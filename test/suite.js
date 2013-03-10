var magellan = require('../magellan')
var assert = require('assert')

/* IDEMPOTENCY */

// must get the same result when coverting between formats consecutively
assert.equal('123.4567', magellan(magellan(123.4567).toDMS()).toDD())
assert.equal('123°27\'24.1200"W', magellan(magellan(-123.4567).longitude().toDMS()).toDMS())
assert.equal('12.3456', magellan(magellan(12.3456).toDMS(' ')).toDD())

/* VERSION */

// magellan must expose its version
assert.equal('1.0.1', magellan.version)

/* PARSING */

// magellan must correctly expose the coordinate object that it parses
assert.deepEqual({degrees: 12, minutes: 32, seconds: 13.44, direction: 'N'}, magellan('12 32 13.44 N').coordinate)
assert.deepEqual({degrees: -12, minutes: 0, seconds: 0, direction: 'E'}, magellan('-12', 'E').coordinate)
assert.deepEqual({degrees: -12, minutes: 0, seconds: 0}, magellan('-12').coordinate)
assert.deepEqual({}, magellan().coordinate)

/* VALIDATION */

// latitude must not exceed +/-90 degrees
assert.equal(null, magellan(90.000001).latitude())
assert.equal(null, magellan(-90.1).latitude())
assert.equal(null, magellan('90 01 00').latitude())
assert.equal(null, magellan('90 00 00.1').latitude())
assert.equal(null, magellan('90°00\'0.0001"').latitude())
assert.equal(null, magellan('91°00\'00"').latitude())

// latitude must be north or south and not east or west
assert.notEqual(null, magellan('N89°12\'15.456"').latitude())
assert.notEqual(null, magellan('S89°12\'15.456"').latitude())
assert.equal(null, magellan('89°12\'15.456" E').latitude())
assert.equal(null, magellan('89°12\'15.456" W').latitude())

// longitude must not exceed +/-180 degrees
assert.equal(null, magellan(180.000001).longitude())
assert.equal(null, magellan(-180.1).longitude())
assert.equal(null, magellan('180 01 00').longitude())
assert.equal(null, magellan('180 00 00.1').longitude())
assert.equal(null, magellan('180°00\'0.0001"').longitude())
assert.equal(null, magellan('181°00\'00"').longitude())

// longitude must be east or west and not north or south
assert.notEqual(null, magellan('89°12\'15.456"E').longitude())
assert.notEqual(null, magellan('89°12\'15.456"W').longitude())
assert.equal(null, magellan('89°12\'15.456"S').longitude())
assert.equal(null, magellan('89°12\'15.456"N').longitude())

/* FORMATTING */

assert.equal('123°q27\'q21.6000"qE', magellan(123.456, 'E').toDMS('q'))
assert.equal('123°27\'21.6000"E', magellan(123.456).longitude().toDMS())
assert.equal('123.4560', magellan('123°27\'21.6"E').toDD())
assert.equal('123.4560', magellan('123°27\'21.6"').longitude().toDD())
assert.equal('-123.0000', magellan(-123).toDD())
assert.equal('123°27\'21.6000"W', magellan(-123.456).longitude().toDMS())
assert.equal('12.3000', magellan(12.3).toDD())
assert.equal('12° 20\' 44.1600" S', magellan(-12.3456).latitude().toDMS(' '))

