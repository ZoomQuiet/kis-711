
/**
 * Module dependencies.
 */

var Buffer = require('buffer').Buffer; // TODO just use global Buffer
var bson = require('./bson');

/**
 * Binary constructor.
 *
 * @param {Buffer} buffer (optional)
 */

function Binary (buffer) {
  this.sub_type = bson.BSON.BSON_BINARY_SUBTYPE_BYTE_ARRAY;

  if (buffer) {
    this.buffer = buffer;
    this.position = buffer.length;
  } else {
    this.buffer = new Buffer(Binary.BUFFER_SIZE);
    this.position = 0;
  }
};

/**
 * Updates this binary with `byte_value`.
 *
 * @param {TODO} byte_value
 */

Binary.prototype.put = function put (byte_value) {
  if (this.buffer.length > this.position) {
    this.buffer[this.position++] = byte_value.charCodeAt(0);
  } else {
    // Create additional overflow buffer
    var buffer = new Buffer(Binary.BUFFER_SIZE + this.buffer.length);
    // Combine the two buffers together
    this.buffer.copy(buffer, 0, 0, this.buffer.length);
    this.buffer = buffer;
    this.buffer[this.position++] = byte_value.charCodeAt(0);
  }
};

/**
 * Writes.
 *
 * @param {String} string
 * @param {Number} offset
 */

Binary.prototype.write = function write (string, offset) {
  offset = offset ? offset : this.position;

  // If the buffer is to small let's extend the buffer
  if (this.buffer.length < offset + string.length) {
    var buffer = new Buffer(this.buffer.length + string.length);
    this.buffer.copy(buffer, 0, 0, this.buffer.length);
    // Assign the new buffer
    this.buffer = buffer;
  }

  if (string instanceof Buffer) {
    string.copy(this.buffer, offset, 0, string.length);
  } else {
	  this.buffer.write(string, 'binary', offset);
  }

  this.position = offset + string.length;
};

/**
 * Reads `length` bytes starting at `position`.
 *
 * @param {Number} position
 * @param {Number} length
 * @return {String}
 */

Binary.prototype.read = function read (position, length) {
  length = length && length > 0
    ? length
    : this.position;

  return this.buffer.toString('binary', position, position + length);
};

/**
 * Returns the value of this binary as a string.
 *
 * @return {String}
 */

Binary.prototype.value = function value () {
  return this.buffer.toString('binary', 0, this.position);
};

/**
 * Length.
 *
 * @return {Number}
 */

Binary.prototype.length = function length () {
  return this.position;
};

Binary.BUFFER_SIZE = 256;

/**
 * Expose.
 */

exports.Binary = Binary;

