const request = require('request');
const url = require('url');
let Service, Characteristic;

function mySwitch(log, config) {
	this.log = log;
	this.getUrl = url.parse(config['getUrl']);
	this.postUrl = url.parse(config['postUrl']);
}

mySwitch.prototype = {
	getSwitchOnCharacteristic: function (next) {
		const me = this;
		request({
			url: me.getUrl,
			method: 'GET',
		}, function (error, response, body) {
			if (error) {
				me.log('STATUS: ' + response.statusCode);
				me.log(error.message);
				return next(error);
			}
			return next(null, "on");
		});
	},

	setSwitchOnCharacteristic: function (on, next) {
		const me = this;
		request({
			url: me.postUrl,
			method: 'GET',
		}, function (error, response) {
			if (error) {
				me.log('STATUS: ' + response.statusCode);
				me.log(error.message);
				return next(error);
			}
			return next();
		});
	},

	getServices: function () {
		let informationService = new Service.AccessoryInformation();
		informationService
			.setCharacteristic(Characteristic.Manufacturer, "Panasonic")
			.setCharacteristic(Characteristic.Model, "Some model")
			.setCharacteristic(Characteristic.SerialNumber, "123-456-789");

		let switchService = new Service.Switch("TV");
		switchService
			.getCharacteristic(Characteristic.On)
			.on('get', this.getSwitchOnCharacteristic.bind(this))
			.on('set', this.setSwitchOnCharacteristic.bind(this));

		this.informationService = informationService;
		this.switchService = switchService;
		return [informationService, switchService];
	}
};

module.exports = function (homebridge) {
	Service = homebridge.hap.Service;
	Characteristic = homebridge.hap.Characteristic;
	homebridge.registerAccessory("homebridge-pimote", "TV", mySwitch);
};

