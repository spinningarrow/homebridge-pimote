const request = require('request')
const url = require('url')

let Service
let Characteristic

class TvSwitch {
	constructor(log, config) {
		this.log = log
		this.getUrl = url.parse(config['getUrl'])
		this.postUrl = url.parse(config['postUrl'])
	}

	getSwitchOnCharacteristic(next) {
		request({
			url: this.getUrl,
			method: 'GET',
		}, (error, response, body) => {
			if (error) {
				this.log('STATUS: ' + response.statusCode)
				this.log(error.message)
				return next(error)
			}
			return next(null, "on")
		})
	}

	setSwitchOnCharacteristic(on, next) {
		request({
			url: this.postUrl,
			method: 'GET',
		}, (error, response) => {
			if (error) {
				this.log('STATUS: ' + response.statusCode)
				this.log(error.message)
				return next(error)
			}
			return next()
		})
	}

	getServices() {
		const informationService = new Service.AccessoryInformation()
		informationService
			.setCharacteristic(Characteristic.Manufacturer, "Panasonic")
			.setCharacteristic(Characteristic.Model, "Some model")
			.setCharacteristic(Characteristic.SerialNumber, "123-456-789")

		const switchService = new Service.Switch("TV")
		switchService
			.getCharacteristic(Characteristic.On)
			.on('get', this.getSwitchOnCharacteristic.bind(this))
			.on('set', this.setSwitchOnCharacteristic.bind(this))

		this.informationService = informationService
		this.switchService = switchService
		return [informationService, switchService]
	}
}

module.exports = homebridge => {
	Service = homebridge.hap.Service
	Characteristic = homebridge.hap.Characteristic
	homebridge.registerAccessory("homebridge-pimote", "TV", TvSwitch)
}
