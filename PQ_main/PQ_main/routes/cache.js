const redis = require('redis');
const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);
const STATUS = {
	PENDING: '<PENDING>',
	EXEC: '<EXEC>',
};
const crypto = require('crypto');

(async () => {
	client.on('error', (err) => console.log('Redis Client Error', err));
	await client.connect();
})();

const md5 = (str) => {
	const md5sum = crypto.createHash('md5');
	md5sum.update(str);
	return md5sum.digest('hex');
};

const setRedis = async (userId, groupData, timeout = 60 * 60) => {
	if (typeof val === 'object') {
		val = JSON.stringify(val);
	}
	await client.set(userId, md5(groupData));
	await client.expire(userId, timeout);
};

const saveCache = async (userId, groupData, res, next) => {
	let useCache = true;
	let status = STATUS.EXEC;
	try {
		const reply = await client
			.multi()
			.get(userId)
			.set(userId, STATUS.PENDING)
			.exec();
		if (reply[0] == STATUS.PENDING) {
			status = STATUS.PENDING;
		} else if (reply[0] == null || reply[0] !== md5(groupData)) {
			useCache = false;
			await client.expire(userId, 30);
		} else {
			await client.set(userId, reply[0]);
			await client.expire(userId, 60 * 60);
		}
	} catch (err) {
		next();
		return;
	}
	if (useCache) {
		switch (status) {
			case STATUS.EXEC:
				res.json({ result: 'success' });
				break;
			case STATUS.PENDING:
				res.json({ result: 'pending' });
				break;
		}
		return;
	} else {
		next();
		return;
	}
};

module.exports.saveCache = saveCache;
module.exports.setRedis = setRedis;
