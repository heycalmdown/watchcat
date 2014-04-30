var filesize = require('filesize');
var Table = require('cli-table');

var xx = {};

function drawTable(rows) {
	var table = new Table({
		head: ['Name', 'Time Diff(ms)', 'RSS Diff', 'HeapUsed Diff', 'HeapTotal Diff']
	});
	rows.forEach(function (row) {
		table.push(row);
	});
	if (process.stdout.columns < table.width) {
		return;
	}
	console.info(table.toString());
}

exports.time = function (name) {
	if (xx[name]) throw new Error(name + ': already registered');
	xx[name] = {
		timeAtStarted: new Date(),
		memoryAtStarted: process.memoryUsage()
	};
};

exports.timeEnd = function (name) {
	if (!xx[name]) throw new Error(name + ': not registered');
	var now = new Date();
	var memoryUsage = process.memoryUsage();
	var oldMemUsage = xx[name].memoryAtStarted;
	xx[name].result = [name,
		now - xx[name].timeAtStarted,
		filesize(memoryUsage.rss - oldMemUsage.rss),
		filesize(memoryUsage.heapUsed - oldMemUsage.heapUsed),
		filesize(memoryUsage.heapTotal - oldMemUsage.heapTotal)
	];
};

exports.report = function () {
	drawTable(Object.values(xx).pluck('result'));
};

// TODO
// 계층도 넣고 싶다
// * DB
// * DB.roster
// * DB.static
// * CACHE
// * CACHE.STUB
// * CACHE.POOL
// * CACHE.POOL.ITEM
// 이런 식으로

