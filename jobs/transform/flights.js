const { parentPort } = require("worker_threads");
function print(message) { if (parentPort != null) parentPort.postMessage(message); }

const DatabaseHelper = require('../../helper/DatabaseHelper');
const ModelHelper = require('../../helper/ModelHelper');
const _ = require('underscore');
const datefns = require('date-fns');

let jobName = 'flights';
const Model = ModelHelper.models[jobName];
const inbound_alerts = ModelHelper.models['inbound_alerts'];
const outbound_alerts = ModelHelper.models['outbound_alerts'];

let isCancelled = false;
if (parentPort) {
    parentPort.once("message", (message) => {
        if (message === "cancel") isCancelled = true;
    });
}

(async () => {
    try {
        var startTime = new Date();
        print(`[${jobName}] Starting transform on ${startTime.toISOString()}`);

        //Initiate database connection and define model that we need to use
        await DatabaseHelper.connect();

        //Start writing your code below
        var doc = {
            timestamp: startTime,
            data: {
                inbound_flights: [],
                outbound_flights: []
            }
        };

        var inbound = await inbound_alerts.findOne()
            .sort('-timestamp');
        var outbound = await outbound_alerts.findOne()
            .sort('-timestamp');

        doc.data.inbound_flights = process_inbound(inbound.data.sevenDays.entries);
        doc.data.outbound_flights = process_outbound(outbound.data.sevenDays.entries);

        var query = { timestamp: doc.timestamp },
            update = doc,
            options = { upsert: true, new: true, setDefaultsOnInsert: true };

        await Model.findOneAndUpdate(query, update, options);

        //Finish your code above
        print(`[${jobName}] Transform completed in ${(Date.now() - startTime) / 1000.0} seconds`);
    } catch (e) {
        print(`[${jobName}] ${e}`);
    } finally {
        //Close database connection
        DatabaseHelper.disconnect();
        process.exit(0);
    }
})();

function process_inbound(data) {
    return _.chain(data)
        .filter('OriCtryCode')
        .countBy('OriCtryCode')
        .map((v, k) => {
            return {
                country: k,
                coords: coords[k],
                count: v,
            }
        })
}

function process_outbound(data) {
    return _.chain(data)
        .filter('C_COUNTRY')
        .countBy('C_COUNTRY')
        .map((v, k) => {
            return {
                country: k,
                coords: coords[k],
                count: v,
            }
        })
}

const coords = {
    AF: '33,65',
    AL: '41,20',
    DZ: '28,3',
    AS: '-14.3333,-170',
    AD: '42.5,1.6',
    AO: '-12.5,18.5',
    AI: '18.25,-63.1667',
    AQ: '-90,0',
    AG: '17.05,-61.8',
    AR: '-34,-64',
    AM: '40,45',
    AW: '12.5,-69.9667',
    AU: '-27,133',
    AT: '47.3333,13.3333',
    AZ: '40.5,47.5',
    BS: '24.25,-76',
    BH: '26,50.55',
    BD: '24,90',
    BB: '13.1667,-59.5333',
    BY: '53,28',
    BE: '50.8333,4',
    BZ: '17.25,-88.75',
    BJ: '9.5,2.25',
    BM: '32.3333,-64.75',
    BT: '27.5,90.5',
    BO: '-17,-65',
    BO: '-17,-65',
    BA: '44,18',
    BW: '-22,24',
    BV: '-54.4333,3.4',
    BR: '-10,-55',
    IO: '-6,71.5',
    BN: '4.5,114.6667',
    BN: '4.5,114.6667',
    BG: '43,25',
    BF: '13,-2',
    BI: '-3.5,30',
    KH: '13,105',
    CM: '6,12',
    CA: '60,-95',
    CV: '16,-24',
    KY: '19.5,-80.5',
    CF: '7,21',
    TD: '15,19',
    CL: '-30,-71',
    CN: '35,105',
    CX: '-10.5,105.6667',
    CC: '-12.5,96.8333',
    CO: '4,-72',
    KM: '-12.1667,44.25',
    CG: '-1,15',
    CD: '0,25',
    CK: '-21.2333,-159.7667',
    CR: '10,-84',
    CI: '8,-5',
    CI: '8,-5',
    HR: '45.1667,15.5',
    CU: '21.5,-80',
    CY: '35,33',
    CZ: '49.75,15.5',
    DK: '56,10',
    DJ: '11.5,43',
    DM: '15.4167,-61.3333',
    DO: '19,-70.6667',
    EC: '-2,-77.5',
    EG: '27,30',
    SV: '13.8333,-88.9167',
    GQ: '2,10',
    ER: '15,39',
    EE: '59,26',
    ET: '8,38',
    FK: '-51.75,-59',
    FO: '62,-7',
    FJ: '-18,175',
    FI: '64,26',
    FR: '46,2',
    GF: '4,-53',
    PF: '-15,-140',
    TF: '-43,67',
    GA: '-1,11.75',
    GM: '13.4667,-16.5667',
    GE: '42,43.5',
    DE: '51,9',
    GH: '8,-2',
    GI: '36.1833,-5.3667',
    GR: '39,22',
    GL: '72,-40',
    GD: '12.1167,-61.6667',
    GP: '16.25,-61.5833',
    GU: '13.4667,144.7833',
    GT: '15.5,-90.25',
    GG: '49.5,-2.56',
    GN: '11,-10',
    GW: '12,-15',
    GY: '5,-59',
    HT: '19,-72.4167',
    HM: '-53.1,72.5167',
    VA: '41.9,12.45',
    HN: '15,-86.5',
    HK: '22.25,114.1667',
    HU: '47,20',
    IS: '65,-18',
    IN: '20,77',
    ID: '-5,120',
    IR: '32,53',
    IQ: '33,44',
    IE: '53,-8',
    IM: '54.23,-4.55',
    IL: '31.5,34.75',
    IT: '42.8333,12.8333',
    JM: '18.25,-77.5',
    JP: '36,138',
    JE: '49.21,-2.13',
    JO: '31,36',
    KZ: '48,68',
    KE: '1,38',
    KI: '1.4167,173',
    KP: '40,127',
    KR: '37,127.5',
    KR: '37,127.5',
    KW: '29.3375,47.6581',
    KG: '41,75',
    LA: '18,105',
    LV: '57,25',
    LB: '33.8333,35.8333',
    LS: '-29.5,28.5',
    LR: '6.5,-9.5',
    LY: '25,17',
    LY: '25,17',
    LI: '47.1667,9.5333',
    LT: '56,24',
    LU: '49.75,6.1667',
    MO: '22.1667,113.55',
    MK: '41.8333,22',
    MG: '-20,47',
    MW: '-13.5,34',
    MY: '3.7396,102.183',
    MV: '3.25,73',
    ML: '17,-4',
    MT: '35.8333,14.5833',
    MH: '9,168',
    MQ: '14.6667,-61',
    MR: '20,-12',
    MU: '-20.2833,57.55',
    YT: '-12.8333,45.1667',
    MX: '23,-102',
    FM: '6.9167,158.25',
    MD: '47,29',
    MC: '43.7333,7.4',
    MN: '46,105',
    ME: '42,19',
    MS: '16.75,-62.2',
    MA: '32,-5',
    MZ: '-18.25,35',
    MM: '22,98',
    MM: '22,98',
    NA: '-22,17',
    NR: '-0.5333,166.9167',
    NP: '28,84',
    NL: '52.5,5.75',
    AN: '12.25,-68.75',
    NC: '-21.5,165.5',
    NZ: '-41,174',
    NI: '13,-85',
    NE: '16,8',
    NG: '10,8',
    NU: '-19.0333,-169.8667',
    NF: '-29.0333,167.95',
    MP: '15.2,145.75',
    NO: '62,10',
    OM: '21,57',
    PK: '30,70',
    PW: '7.5,134.5',
    PS: '32,35.25',
    PA: '9,-80',
    PG: '-6,147',
    PY: '-23,-58',
    PE: '-10,-76',
    PH: '13,122',
    PN: '-24.7,-127.4',
    PL: '52,20',
    PT: '39.5,-8',
    PR: '18.25,-66.5',
    QA: '25.5,51.25',
    RE: '-21.1,55.6',
    RO: '46,25',
    RU: '60,100',
    RU: '60,100',
    RW: '-2,30',
    SH: '-15.9333,-5.7',
    KN: '17.3333,-62.75',
    LC: '13.8833,-61.1333',
    PM: '46.8333,-56.3333',
    VC: '13.25,-61.2',
    VC: '13.25,-61.2',
    VC: '13.25,-61.2',
    WS: '-13.5833,-172.3333',
    SM: '43.7667,12.4167',
    ST: '1,7',
    SA: '25,45',
    SN: '14,-14',
    RS: '44,21',
    SC: '-4.5833,55.6667',
    SL: '8.5,-11.5',
    SG: '1.3667,103.8',
    SK: '48.6667,19.5',
    SI: '46,15',
    SB: '-8,159',
    SO: '10,49',
    ZA: '-29,24',
    GS: '-54.5,-37',
    SS: '8,30',
    ES: '40,-4',
    LK: '7,81',
    SD: '15,30',
    SR: '4,-56',
    SJ: '78,20',
    SZ: '-26.5,31.5',
    SE: '62,15',
    CH: '47,8',
    SY: '35,38',
    TW: '23.5,121',
    TW: '23.5,121',
    TJ: '39,71',
    TZ: '-6,35',
    TH: '15,100',
    TL: '-8.55,125.5167',
    TG: '8,1.1667',
    TK: '-9,-172',
    TO: '-20,-175',
    TT: '11,-61',
    TN: '34,9',
    TR: '39,35',
    TM: '40,60',
    TC: '21.75,-71.5833',
    TV: '-8,178',
    UG: '1,32',
    UA: '49,32',
    AE: '24,54',
    GB: '54,-2',
    US: '38,-97',
    UM: '19.2833,166.6',
    UY: '-33,-56',
    UZ: '41,64',
    VU: '-16,167',
    VE: '8,-66',
    VE: '8,-66',
    VN: '16,106',
    VN: '16,106',
    VG: '18.5,-64.5',
    VI: '18.3333,-64.8333',
    WF: '-13.3,-176.2',
    EH: '24.5,-13',
    YE: '15,48',
    ZM: '-15,30',
    ZW: '-20,30',
};