const functions = require('firebase-functions');
const puppeteer = require('puppeteer');
const ejs = require('ejs');
const parser = require("body-parser");
const app = require("express")();
const allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', process.env.FUNCTIONS_EMULATOR ? "*" : `https://${process.env.GCLOUD_PROJECT}.web.app`)
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    res.header(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, access_token'
    )

    // intercept OPTIONS method
    if ('OPTIONS' === req.method) {
        res.send(200)
    } else {
        next()
    }
}
app.use(allowCrossDomain)
app.use(parser.json());

const ITEM_PER_PAGE = 30;

const TransportationTypes = [
    {
        value: "1",
        label: "電車"
    },
    {
        value: "2",
        label: "航空機"
    },
    {
        value: "3",
        label: "タクシー"
    }
]

const TransportationTypesMap = TransportationTypes.reduce((map, type) => {
    map[type.value] = type.label;
    return map;
}, {});


app.post("/genPdf", async (request, response) => {

    const data = request.body
    try {

        data.inputPerSectionList = [];
        const inputs = data.inputList.slice().map(input => {
            input.transportationDispVal = TransportationTypesMap[input.transportation];
            input.costDispVal = (input.cost || 0).toLocaleString();
            return input;
        });
        while (inputs.length) {
            data.inputPerSectionList.push(inputs.splice(0, ITEM_PER_PAGE));
        }
        data.sumOfTranList = TransportationTypes.map(tran => {
            return {
                label: tran.label,
                value: data.inputList.filter(input => input.transportation == tran.value).reduce((sum, input) => {
                    return sum + (input.cost || 0);
                }, 0).toLocaleString()
            }
        })
        data.sum = data.inputList.reduce((sum, input) => {
            return sum + (input.cost || 0);
        }, 0).toLocaleString();
    } catch (e) {
        response.set("Content-Type", "application/json");
        response.status(400).send({ message: "不正なリクエストです" });
    }

    ejs.renderFile("template.html", data, async (err, html) => {
        if (err) {
            console.log(err)
            return response.send(err);
        }
        const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle2' });
        const bin = await page.pdf({ format: "A4" });
        browser.close();
        response.set("Content-Type", "application/pdf");
        response.set('Content-Disposition', `attachment; filename="${encodeURIComponent("交通費請求書")}.pdf`);
        response.send(bin);
    })

})

const runtimeOpts = {
    timeoutSeconds: 30,
    memory: '1GB' // デフォルトの500mbだと足りないので増やしておく
}

exports.api = functions.runWith(runtimeOpts).region('asia-northeast1').https.onRequest(app);
