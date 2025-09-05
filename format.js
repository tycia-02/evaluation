const dayjs = require("dayjs");
require("dayjs/locale/fr.js");
dayjs.locale("fr");

function formatDate(date) {
    return dayjs(date).format("DD/MM/YYYY");
}

module.exports = { formatDate };
