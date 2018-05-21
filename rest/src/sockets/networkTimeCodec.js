/** @module modelBinary/networkTimeCodec */
const catapult = require('catapult-sdk');

const { size } = catapult.modelBinary;
const { convert } = catapult.utils;

const networkTimeCodec = {
	/**
	 * Parses a network time payload.
	 * @param {object} parser The parser.
	 * @returns {object} The parsed node info.
	 */
	deserialize: parser => {
		const networkTime = {
			communicationTimestamps: {
				sendTimestamp: parser.uint64(),
				receiveTimestamp: parser.uint64()
			}
		};
		return networkTime;
	}
};

module.exports = networkTimeCodec;
