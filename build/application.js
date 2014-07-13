// http://ntt.cc/2008/01/19/base64-encoder-decoder-with-javascript.html

// window.atob and window.btoa

(function (window) {

	var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	
	window.btoa || (window.btoa = function encode64(input) {
		input = escape(input);
		var output = "";
		var chr1, chr2, chr3 = "";
		var enc1, enc2, enc3, enc4 = "";
		var i = 0;
		do {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
			output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);
			chr1 = chr2 = chr3 = "";
			enc1 = enc2 = enc3 = enc4 = "";
		} while (i < input.length);
		return output;
	});
	
	window.atob || (window.atob = function(input) {
		var output = "";
		var chr1, chr2, chr3 = "";
		var enc1, enc2, enc3, enc4 = "";
		var i = 0;
		// remove all characters that are not A-Z, a-z, 0-9, +, /, or =
		var base64test = /[^A-Za-z0-9\+\/\=]/g;
		if (base64test.exec(input)) {
			alert("There were invalid base64 characters in the input text.\n" + "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" + "Expect errors in decoding.");
		}
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
		do {
			enc1 = keyStr.indexOf(input.charAt(i++));
			enc2 = keyStr.indexOf(input.charAt(i++));
			enc3 = keyStr.indexOf(input.charAt(i++));
			enc4 = keyStr.indexOf(input.charAt(i++));
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
			output = output + String.fromCharCode(chr1);
			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
			chr1 = chr2 = chr3 = "";
			enc1 = enc2 = enc3 = enc4 = "";
		} while (i < input.length);
		return unescape(output);
	});

}(this));/*
Copyright (c) 2011, Daniel Guerrero
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of the Daniel Guerrero nor the
      names of its contributors may be used to endorse or promote products
      derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL DANIEL GUERRERO BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
 
var Base64Binary = {
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

	/* will return a  Uint8Array type */
	decodeArrayBuffer: function(input) {
		var bytes = Math.ceil( (3*input.length) / 4.0);
		var ab = new ArrayBuffer(bytes);
		this.decode(input, ab);

		return ab;
	},

	decode: function(input, arrayBuffer) {
		//get last chars to see if are valid
		var lkey1 = this._keyStr.indexOf(input.charAt(input.length-1));		 
		var lkey2 = this._keyStr.indexOf(input.charAt(input.length-1));		 

		var bytes = Math.ceil( (3*input.length) / 4.0);
		if (lkey1 == 64) bytes--; //padding chars, so skip
		if (lkey2 == 64) bytes--; //padding chars, so skip

		var uarray;
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
		var j = 0;

		if (arrayBuffer)
			uarray = new Uint8Array(arrayBuffer);
		else
			uarray = new Uint8Array(bytes);

		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

		for (i=0; i<bytes; i+=3) {	
			//get the 3 octects in 4 ascii chars
			enc1 = this._keyStr.indexOf(input.charAt(j++));
			enc2 = this._keyStr.indexOf(input.charAt(j++));
			enc3 = this._keyStr.indexOf(input.charAt(j++));
			enc4 = this._keyStr.indexOf(input.charAt(j++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			uarray[i] = chr1;			
			if (enc3 != 64) uarray[i+1] = chr2;
			if (enc4 != 64) uarray[i+2] = chr3;
		}

		return uarray;	
	}
};/* Wrapper for accessing strings through sequential reads */
function Stream(str) {
	var position = 0;
	
	function read(length) {
		var result = str.substr(position, length);
		position += length;
		return result;
	}
	
	/* read a big-endian 32-bit integer */
	function readInt32() {
		var result = (
			(str.charCodeAt(position) << 24)
			+ (str.charCodeAt(position + 1) << 16)
			+ (str.charCodeAt(position + 2) << 8)
			+ str.charCodeAt(position + 3));
		position += 4;
		return result;
	}

	/* read a big-endian 16-bit integer */
	function readInt16() {
		var result = (
			(str.charCodeAt(position) << 8)
			+ str.charCodeAt(position + 1));
		position += 2;
		return result;
	}
	
	/* read an 8-bit integer */
	function readInt8() {
		var result = str.charCodeAt(position);
		position += 1;
		return result;
	}
	
	function eof() {
		return position >= str.length;
	}
	
	/* read a MIDI-style variable-length integer
		(big-endian value in groups of 7 bits,
		with top bit set to signify that another byte follows)
	*/
	function readVarInt() {
		var result = 0;
		while (true) {
			var b = readInt8();
			if (b & 0x80) {
				result += (b & 0x7f);
				result <<= 7;
			} else {
				/* b is the last byte */
				return result + b;
			}
		}
	}
	
	return {
		'eof': eof,
		'read': read,
		'readInt32': readInt32,
		'readInt16': readInt16,
		'readInt8': readInt8,
		'readVarInt': readVarInt
	}
}/*
class to parse the .mid file format
(depends on stream.js)
*/
function MidiFile(data) {
	function readChunk(stream) {
		var id = stream.read(4);
		var length = stream.readInt32();
		return {
			'id': id,
			'length': length,
			'data': stream.read(length)
		};
	}

	var lastEventTypeByte;

	function readEvent(stream) {
		var event = {};
		event.deltaTime = stream.readVarInt();
		var eventTypeByte = stream.readInt8();
		if ((eventTypeByte & 0xf0) == 0xf0) {
			/* system / meta event */
			if (eventTypeByte == 0xff) {
				/* meta event */
				event.type = 'meta';
				var subtypeByte = stream.readInt8();
				var length = stream.readVarInt();
				switch(subtypeByte) {
					case 0x00:
						event.subtype = 'sequenceNumber';
						if (length != 2) throw "Expected length for sequenceNumber event is 2, got " + length;
						event.number = stream.readInt16();
						return event;
					case 0x01:
						event.subtype = 'text';
						event.text = stream.read(length);
						return event;
					case 0x02:
						event.subtype = 'copyrightNotice';
						event.text = stream.read(length);
						return event;
					case 0x03:
						event.subtype = 'trackName';
						event.text = stream.read(length);
						return event;
					case 0x04:
						event.subtype = 'instrumentName';
						event.text = stream.read(length);
						return event;
					case 0x05:
						event.subtype = 'lyrics';
						event.text = stream.read(length);
						return event;
					case 0x06:
						event.subtype = 'marker';
						event.text = stream.read(length);
						return event;
					case 0x07:
						event.subtype = 'cuePoint';
						event.text = stream.read(length);
						return event;
					case 0x20:
						event.subtype = 'midiChannelPrefix';
						if (length != 1) throw "Expected length for midiChannelPrefix event is 1, got " + length;
						event.channel = stream.readInt8();
						return event;
					case 0x2f:
						event.subtype = 'endOfTrack';
						if (length != 0) throw "Expected length for endOfTrack event is 0, got " + length;
						return event;
					case 0x51:
						event.subtype = 'setTempo';
						if (length != 3) throw "Expected length for setTempo event is 3, got " + length;
						event.microsecondsPerBeat = (
							(stream.readInt8() << 16)
							+ (stream.readInt8() << 8)
							+ stream.readInt8()
						)
						return event;
					case 0x54:
						event.subtype = 'smpteOffset';
						if (length != 5) throw "Expected length for smpteOffset event is 5, got " + length;
						var hourByte = stream.readInt8();
						event.frameRate = {
							0x00: 24, 0x20: 25, 0x40: 29, 0x60: 30
						}[hourByte & 0x60];
						event.hour = hourByte & 0x1f;
						event.min = stream.readInt8();
						event.sec = stream.readInt8();
						event.frame = stream.readInt8();
						event.subframe = stream.readInt8();
						return event;
					case 0x58:
						event.subtype = 'timeSignature';
						if (length != 4) throw "Expected length for timeSignature event is 4, got " + length;
						event.numerator = stream.readInt8();
						event.denominator = Math.pow(2, stream.readInt8());
						event.metronome = stream.readInt8();
						event.thirtyseconds = stream.readInt8();
						return event;
					case 0x59:
						event.subtype = 'keySignature';
						if (length != 2) throw "Expected length for keySignature event is 2, got " + length;
						event.key = stream.readInt8();
						event.scale = stream.readInt8();
						return event;
					case 0x7f:
						event.subtype = 'sequencerSpecific';
						event.data = stream.read(length);
						return event;
					default:
						// console.log("Unrecognised meta event subtype: " + subtypeByte);
						event.subtype = 'unknown'
						event.data = stream.read(length);
						return event;
				}
				event.data = stream.read(length);
				return event;
			} else if (eventTypeByte == 0xf0) {
				event.type = 'sysEx';
				var length = stream.readVarInt();
				event.data = stream.read(length);
				return event;
			} else if (eventTypeByte == 0xf7) {
				event.type = 'dividedSysEx';
				var length = stream.readVarInt();
				event.data = stream.read(length);
				return event;
			} else {
				throw "Unrecognised MIDI event type byte: " + eventTypeByte;
			}
		} else {
			/* channel event */
			var param1;
			if ((eventTypeByte & 0x80) == 0) {
				/* running status - reuse lastEventTypeByte as the event type.
					eventTypeByte is actually the first parameter
				*/
				param1 = eventTypeByte;
				eventTypeByte = lastEventTypeByte;
			} else {
				param1 = stream.readInt8();
				lastEventTypeByte = eventTypeByte;
			}
			var eventType = eventTypeByte >> 4;
			event.channel = eventTypeByte & 0x0f;
			event.type = 'channel';
			switch (eventType) {
				case 0x08:
					event.subtype = 'noteOff';
					event.noteNumber = param1;
					event.velocity = stream.readInt8();
					return event;
				case 0x09:
					event.noteNumber = param1;
					event.velocity = stream.readInt8();
					if (event.velocity == 0) {
						event.subtype = 'noteOff';
					} else {
						event.subtype = 'noteOn';
					}
					return event;
				case 0x0a:
					event.subtype = 'noteAftertouch';
					event.noteNumber = param1;
					event.amount = stream.readInt8();
					return event;
				case 0x0b:
					event.subtype = 'controller';
					event.controllerType = param1;
					event.value = stream.readInt8();
					return event;
				case 0x0c:
					event.subtype = 'programChange';
					event.programNumber = param1;
					return event;
				case 0x0d:
					event.subtype = 'channelAftertouch';
					event.amount = param1;
					return event;
				case 0x0e:
					event.subtype = 'pitchBend';
					event.value = param1 + (stream.readInt8() << 7);
					return event;
				default:
					throw "Unrecognised MIDI event type: " + eventType
					/* 
					console.log("Unrecognised MIDI event type: " + eventType);
					stream.readInt8();
					event.subtype = 'unknown';
					return event;
					*/
			}
		}
	}

	stream = Stream(data);
	var headerChunk = readChunk(stream);
	if (headerChunk.id != 'MThd' || headerChunk.length != 6) {
		throw "Bad .mid file - header not found";
	}
	var headerStream = Stream(headerChunk.data);
	var formatType = headerStream.readInt16();
	var trackCount = headerStream.readInt16();
	var timeDivision = headerStream.readInt16();

	if (timeDivision & 0x8000) {
		throw "Expressing time division in SMTPE frames is not supported yet"
	} else {
		ticksPerBeat = timeDivision;
	}

	var header = {
		'formatType': formatType,
		'trackCount': trackCount,
		'ticksPerBeat': ticksPerBeat
	}
	var tracks = [];
	for (var i = 0; i < header.trackCount; i++) {
		tracks[i] = [];
		var trackChunk = readChunk(stream);
		if (trackChunk.id != 'MTrk') {
			throw "Unexpected chunk - expected MTrk, got "+ trackChunk.id;
		}
		var trackStream = Stream(trackChunk.data);
		while (!trackStream.eof()) {
			var event = readEvent(trackStream);
			tracks[i].push(event);
			//console.log(event);
		}
	}

	return {
		'header': header,
		'tracks': tracks
	}
}var clone = function (o) {
	if (typeof o != 'object') return (o);
	if (o == null) return (o);
	var ret = (typeof o.length == 'number') ? [] : {};
	for (var key in o) ret[key] = clone(o[key]);
	return ret;
};

function Replayer(midiFile, timeWarp, eventProcessor) {
//console.log(midiFile)
	var trackStates = [];
	var beatsPerMinute = 120;
	var ticksPerBeat = midiFile.header.ticksPerBeat;
	for (var i = 0; i < midiFile.tracks.length; i++) {
		trackStates[i] = {
			"nextEventIndex": 0,
			"ticksToNextEvent": (
				midiFile.tracks[i].length ? midiFile.tracks[i][0].deltaTime : null
			)
		};
	}
	function getNextEvent() {
		var ticksToNextEvent = null;
		var nextEventTrack = null;
		var nextEventIndex = null;
		for (var i = 0; i < trackStates.length; i++) {
			if (trackStates[i].ticksToNextEvent != null && (ticksToNextEvent == null || trackStates[i].ticksToNextEvent < ticksToNextEvent)) {
				ticksToNextEvent = trackStates[i].ticksToNextEvent;
				nextEventTrack = i;
				nextEventIndex = trackStates[i].nextEventIndex;
			}
		}
		if (nextEventTrack != null) {
			/// consume event from that track
			var nextEvent = midiFile.tracks[nextEventTrack][nextEventIndex];
			if (midiFile.tracks[nextEventTrack][nextEventIndex + 1]) {
				trackStates[nextEventTrack].ticksToNextEvent += midiFile.tracks[nextEventTrack][nextEventIndex + 1].deltaTime;
			} else {
				trackStates[nextEventTrack].ticksToNextEvent = null;
			}
			trackStates[nextEventTrack].nextEventIndex += 1;
			/// advance timings on all tracks by ticksToNextEvent
			for (var i = 0; i < trackStates.length; i++) {
				if (trackStates[i].ticksToNextEvent != null) {
					trackStates[i].ticksToNextEvent -= ticksToNextEvent
				}
			}
			return {
				"ticksToEvent": ticksToNextEvent,
				"event": nextEvent,
				"track": nextEventTrack
			}
		} else {
			return null;
		}
	};
	//
	var midiEvent;
	var temporal = [];
	//
	function processEvents() {
		function processNext() {
			if (midiEvent.ticksToEvent > 0) {
				var beatsToGenerate = midiEvent.ticksToEvent / ticksPerBeat;
				var secondsToGenerate = beatsToGenerate / (beatsPerMinute / 60);
			}
			var time = secondsToGenerate * 1000 * timeWarp || 0;
			temporal.push([ midiEvent, time]);
			midiEvent = getNextEvent();
		};
		//
		if (midiEvent = getNextEvent()) {
			while(midiEvent) processNext(true);
		}
	};
	processEvents();
	return {
		"getData": function() {
//		console.log(temporal)
			return clone(temporal);
		}
	};
};/*

	DOMLoader.XMLHttp : 0.1 : mudcu.be
	-----------------------------------
	DOMLoader.sendRequest({
		url: "./dir/something.extension",
		error: function(event) {
			console.log(event);
		},
		callback: function(response) {
			console.log(response.responseText);
		}, 
		progress: function (event) {
			var percent = event.loaded / event.total * 100 >> 0;
			loader.message("loading: " + percent + "%");
		}
	});
	
*/

if (typeof(DOMLoader) === "undefined") DOMLoader = {};

(function() { "use strict";

// Add XMLHttpRequest when not available

if (typeof (window.XMLHttpRequest) === "undefined") {
	(function () { // http://www.quirksmode.org/js/xmlhttp.html
		var factories = [
		function () {
			return new ActiveXObject("Msxml2.XMLHTTP");
		}, function () {
			return new ActiveXObject("Msxml3.XMLHTTP");
		}, function () {
			return new ActiveXObject("Microsoft.XMLHTTP");
		}];
		for (var i = 0; i < factories.length; i++) {
			try {
				factories[i]();
			} catch (e) {
				continue;
			}
			break;
		}
		window.XMLHttpRequest = factories[i];
	})();
}

if (typeof ((new XMLHttpRequest()).responseText) === "undefined") {
	// http://stackoverflow.com/questions/1919972/how-do-i-access-xhr-responsebody-for-binary-data-from-javascript-in-ie
    var IEBinaryToArray_ByteStr_Script =
    "<!-- IEBinaryToArray_ByteStr -->\r\n"+
    "<script type='text/vbscript'>\r\n"+
    "Function IEBinaryToArray_ByteStr(Binary)\r\n"+
    "   IEBinaryToArray_ByteStr = CStr(Binary)\r\n"+
    "End Function\r\n"+
    "Function IEBinaryToArray_ByteStr_Last(Binary)\r\n"+
    "   Dim lastIndex\r\n"+
    "   lastIndex = LenB(Binary)\r\n"+
    "   if lastIndex mod 2 Then\r\n"+
    "       IEBinaryToArray_ByteStr_Last = Chr( AscB( MidB( Binary, lastIndex, 1 ) ) )\r\n"+
    "   Else\r\n"+
    "       IEBinaryToArray_ByteStr_Last = "+'""'+"\r\n"+
    "   End If\r\n"+
    "End Function\r\n"+
    "</script>\r\n";

	// inject VBScript
	document.write(IEBinaryToArray_ByteStr_Script);

	DOMLoader.sendRequest = function(config) {
		// helper to convert from responseBody to a "responseText" like thing
		function getResponseText(binary) {
			var byteMapping = {};
			for (var i = 0; i < 256; i++) {
				for (var j = 0; j < 256; j++) {
					byteMapping[String.fromCharCode(i + j * 256)] = String.fromCharCode(i) + String.fromCharCode(j);
				}
			}
			// call into VBScript utility fns
			var rawBytes = IEBinaryToArray_ByteStr(binary);
			var lastChr = IEBinaryToArray_ByteStr_Last(binary);
			return rawBytes.replace(/[\s\S]/g, function (match) {
				return byteMapping[match];
			}) + lastChr;
		}
		//
		var req = new XMLHttpRequest();
		req.open("GET", config.url, true);
		req.setRequestHeader("Accept-Charset", "x-user-defined");
		if (config.responseType) req.responseType = config.responseType;
		if (config.error) req.onerror = config.error;
		if (config.progress) req.onprogress = config.progress;
		req.onreadystatechange = function (event) {
			if (req.readyState === 4) {
				if (req.status === 200) {
					req.responseText = getResponseText(req.responseBody);
				} else {
					req = false;
				}
				if (config.callback) config.callback(req);
			}
		};
		req.send(null);
		return req;
	}
} else {
	DOMLoader.sendRequest = function(config) {
		var req = new XMLHttpRequest();
		req.open('GET', config.url, true);
        if (req.overrideMimeType) req.overrideMimeType("text/plain; charset=x-user-defined");
		if (config.responseType) req.responseType = config.responseType;
		if (config.error) req.onerror = config.error;
		if (config.progress) req.onprogress = config.progress;
		req.onreadystatechange = function (event) {
			if (req.readyState === 4) {
				if (req.status !== 200) req = false;
				if (config.callback) config.callback(req);
			}
		};
		req.send("");
		return req;
	};
}

})();/*

	DOMLoader : 0.2 : mudcu.be
	---------------------------
	DOMLoader.script.add({
		strictOrder: true,
		srcs: [
			{
				src: "../js/jszip/jszip.js",
				verify: "JSZip",
				callback: function() {
					console.log(1)
				}
			},
			{ 
				src: "../inc/downloadify/js/swfobject.js",
				verify: "swfobject",
				callback: function() {
					console.log(2)
				}
			}
		],
		callback: function() {
			console.log(3)
		}
	});
	
*/

if (typeof(DOMLoader) === "undefined") DOMLoader = {};

DOMLoader.script = function() {
	this.loaded = {};
	this.loading = {};
	return this;
};

DOMLoader.script.prototype.add = function(config) {
	var that = this;
	var srcs = config.srcs;
	if (typeof(srcs) === "undefined") {
		srcs = [{ 
			src: config.src, 
			verify: config.verify
		}];
	}
	/// adding the elements to the head
	var doc = document.getElementsByTagName("head")[0];
	/// 
	var testElement = function(element, test) {
		if (that.loaded[element.src]) return;
		if (test && !eval(test)) return;
		that.loaded[element.src] = true;
		//
		if (that.loading[element.src]) that.loading[element.src]();
		delete that.loading[element.src];
		//
		if (element.callback) element.callback();
		if (typeof(getNext) !== "undefined") getNext();
	};
	///
	var batchTest = [];
	var addElement = function(element) {
		if (/([\w\d.\[\]])$/.test(element.verify)) { // check whether its a variable reference
			element.test = "(typeof(" + element.verify + ") !== \"undefined\")";
			batchTest.push(element.test);
		}
		var script = document.createElement("script");
		script.onreadystatechange = function() {
			if (this.readyState !== "loaded" && this.readyState !== "complete") return;
			testElement(element);
		};
		script.onload = function() {
			testElement(element);
		};
		script.setAttribute("type", "text/javascript");
		script.setAttribute("src", element.src);
		doc.appendChild(script);
		that.loading[element.src] = function() {};
	};
	/// checking to see whether everything loaded properly
	var onLoad = function(element) {
		if (element) {
			testElement(element, element.test);
		} else {
			for (var n = 0; n < srcs.length; n ++) {
				testElement(srcs[n], srcs[n].test);
			}
		}
		if (!config.strictOrder && eval(batchTest.join(" && "))) { // finished loading all the requested scripts
			if (config.callback) config.callback();
		} else { // keep calling back the function
			setTimeout(function() { //- should get slower over time?
				onLoad(element);
			}, 10);
		}
	};
	/// loading methods;  strict ordering or loose ordering
	if (config.strictOrder) {
		var ID = -1;
		var getNext = function() {
			ID ++;
			if (!srcs[ID]) { // all elements are loaded
				if (config.callback) config.callback();
			} else { // loading new script
				var element = srcs[ID];
				var src = element.src;
				if (that.loading[src]) { // already loading from another call (attach to event)
					that.loading[src] = function() {
						if (element.callback) element.callback();
						getNext();
					}
				} else if (!that.loaded[src]) { // create script element
					addElement(element);
					onLoad(element);
				} else { // it's already been successfully loaded
					getNext();
				}
			}
		};
		getNext();
	} else { // loose ordering
		for (var ID = 0; ID < srcs.length; ID ++) {
			if (that.loaded[srcs[ID].src]) return;
			addElement(srcs[ID]);
		}
		onLoad();
	}
};

DOMLoader.script = (new DOMLoader.script());/*

	MIDI.audioDetect : 0.3
	-------------------------------------
	https://github.com/mudx/MIDI.js
	-------------------------------------
	Probably, Maybe, No... Absolutely!
	-------------------------------------
	Test to see what types of <audio> MIME types are playable by the browser.

*/

if (typeof(MIDI) === "undefined") var MIDI = {};

(function() { "use strict";

var supports = {};	
var canPlayThrough = function (src) {
	var audio = new Audio();
	var mime = src.split(";")[0];
	audio.id = "audio";
	audio.setAttribute("preload", "auto");
	audio.setAttribute("audiobuffer", true);
	audio.addEventListener("canplaythrough", function() {
		supports[mime] = true;
	}, false);
	audio.src = "data:" + src;
	document.body.appendChild(audio);
};

MIDI.audioDetect = function(callback) {
	// check whether <audio> tag is supported
	if (typeof(Audio) === "undefined") return callback({});
	// check whether canPlayType is supported
	var audio = new Audio();
	if (typeof(audio.canPlayType) === "undefined") return callback(supports);
	// see what we can learn from the browser
	var vorbis = audio.canPlayType('audio/ogg; codecs="vorbis"');
	vorbis = (vorbis === "probably" || vorbis === "maybe");
	var mpeg = audio.canPlayType('audio/mpeg');
	mpeg = (mpeg === "probably" || mpeg === "maybe");
	// maybe nothing is supported
	if (!vorbis && !mpeg) {
		callback(supports);
		return;
	}
	// or maybe something is supported
	if (vorbis) canPlayThrough("audio/ogg;base64,T2dnUwACAAAAAAAAAADqnjMlAAAAAOyyzPIBHgF2b3JiaXMAAAAAAUAfAABAHwAAQB8AAEAfAACZAU9nZ1MAAAAAAAAAAAAA6p4zJQEAAAANJGeqCj3//////////5ADdm9yYmlzLQAAAFhpcGguT3JnIGxpYlZvcmJpcyBJIDIwMTAxMTAxIChTY2hhdWZlbnVnZ2V0KQAAAAABBXZvcmJpcw9CQ1YBAAABAAxSFCElGVNKYwiVUlIpBR1jUFtHHWPUOUYhZBBTiEkZpXtPKpVYSsgRUlgpRR1TTFNJlVKWKUUdYxRTSCFT1jFloXMUS4ZJCSVsTa50FkvomWOWMUYdY85aSp1j1jFFHWNSUkmhcxg6ZiVkFDpGxehifDA6laJCKL7H3lLpLYWKW4q91xpT6y2EGEtpwQhhc+211dxKasUYY4wxxsXiUyiC0JBVAAABAABABAFCQ1YBAAoAAMJQDEVRgNCQVQBABgCAABRFcRTHcRxHkiTLAkJDVgEAQAAAAgAAKI7hKJIjSZJkWZZlWZameZaouaov+64u667t6roOhIasBACAAAAYRqF1TCqDEEPKQ4QUY9AzoxBDDEzGHGNONKQMMogzxZAyiFssLqgQBKEhKwKAKAAAwBjEGGIMOeekZFIi55iUTkoDnaPUUcoolRRLjBmlEluJMYLOUeooZZRCjKXFjFKJscRUAABAgAMAQICFUGjIigAgCgCAMAYphZRCjCnmFHOIMeUcgwwxxiBkzinoGJNOSuWck85JiRhjzjEHlXNOSuekctBJyaQTAAAQ4AAAEGAhFBqyIgCIEwAwSJKmWZomipamiaJniqrqiaKqWp5nmp5pqqpnmqpqqqrrmqrqypbnmaZnmqrqmaaqiqbquqaquq6nqrZsuqoum65q267s+rZru77uqapsm6or66bqyrrqyrbuurbtS56nqqKquq5nqq6ruq5uq65r25pqyq6purJtuq4tu7Js664s67pmqq5suqotm64s667s2rYqy7ovuq5uq7Ks+6os+75s67ru2rrwi65r66os674qy74x27bwy7ouHJMnqqqnqq7rmarrqq5r26rr2rqmmq5suq4tm6or26os67Yry7aumaosm64r26bryrIqy77vyrJui67r66Ys67oqy8Lu6roxzLat+6Lr6roqy7qvyrKuu7ru+7JuC7umqrpuyrKvm7Ks+7auC8us27oxuq7vq7It/KosC7+u+8Iy6z5jdF1fV21ZGFbZ9n3d95Vj1nVhWW1b+V1bZ7y+bgy7bvzKrQvLstq2scy6rSyvrxvDLux8W/iVmqratum6um7Ksq/Lui60dd1XRtf1fdW2fV+VZd+3hV9pG8OwjK6r+6os68Jry8ov67qw7MIvLKttK7+r68ow27qw3L6wLL/uC8uq277v6rrStXVluX2fsSu38QsAABhwAAAIMKEMFBqyIgCIEwBAEHIOKQahYgpCCKGkEEIqFWNSMuakZM5JKaWUFEpJrWJMSuaclMwxKaGUlkopqYRSWiqlxBRKaS2l1mJKqcVQSmulpNZKSa2llGJMrcUYMSYlc05K5pyUklJrJZXWMucoZQ5K6iCklEoqraTUYuacpA46Kx2E1EoqMZWUYgupxFZKaq2kFGMrMdXUWo4hpRhLSrGVlFptMdXWWqs1YkxK5pyUzDkqJaXWSiqtZc5J6iC01DkoqaTUYiopxco5SR2ElDLIqJSUWiupxBJSia20FGMpqcXUYq4pxRZDSS2WlFosqcTWYoy1tVRTJ6XFklKMJZUYW6y5ttZqDKXEVkqLsaSUW2sx1xZjjqGkFksrsZWUWmy15dhayzW1VGNKrdYWY40x5ZRrrT2n1mJNMdXaWqy51ZZbzLXnTkprpZQWS0oxttZijTHmHEppraQUWykpxtZara3FXEMpsZXSWiypxNhirLXFVmNqrcYWW62ltVprrb3GVlsurdXcYqw9tZRrrLXmWFNtBQAADDgAAASYUAYKDVkJAEQBAADGMMYYhEYpx5yT0ijlnHNSKucghJBS5hyEEFLKnINQSkuZcxBKSSmUklJqrYVSUmqttQIAAAocAAACbNCUWByg0JCVAEAqAIDBcTRNFFXVdX1fsSxRVFXXlW3jVyxNFFVVdm1b+DVRVFXXtW3bFn5NFFVVdmXZtoWiqrqybduybgvDqKqua9uybeuorqvbuq3bui9UXVmWbVu3dR3XtnXd9nVd+Bmzbeu2buu+8CMMR9/4IeTj+3RCCAAAT3AAACqwYXWEk6KxwEJDVgIAGQAAgDFKGYUYM0gxphhjTDHGmAAAgAEHAIAAE8pAoSErAoAoAADAOeecc84555xzzjnnnHPOOeecc44xxhhjjDHGGGOMMcYYY4wxxhhjjDHGGGOMMcYYY0wAwE6EA8BOhIVQaMhKACAcAABACCEpKaWUUkoRU85BSSmllFKqFIOMSkoppZRSpBR1lFJKKaWUIqWgpJJSSimllElJKaWUUkoppYw6SimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaVUSimllFJKKaWUUkoppRQAYPLgAACVYOMMK0lnhaPBhYasBAByAwAAhRiDEEJpraRUUkolVc5BKCWUlEpKKZWUUqqYgxBKKqmlklJKKbXSQSihlFBKKSWUUkooJYQQSgmhlFRCK6mEUkoHoYQSQimhhFRKKSWUzkEoIYUOQkmllNRCSB10VFIpIZVSSiklpZQ6CKGUklJLLZVSWkqpdBJSKamV1FJqqbWSUgmhpFZKSSWl0lpJJbUSSkklpZRSSymFVFJJJYSSUioltZZaSqm11lJIqZWUUkqppdRSSiWlkEpKqZSSUmollZRSaiGVlEpJKaTUSimlpFRCSamlUlpKLbWUSkmptFRSSaWUlEpJKaVSSksppRJKSqmllFpJKYWSUkoplZJSSyW1VEoKJaWUUkmptJRSSymVklIBAEAHDgAAAUZUWoidZlx5BI4oZJiAAgAAQABAgAkgMEBQMApBgDACAQAAAADAAAAfAABHARAR0ZzBAUKCwgJDg8MDAAAAAAAAAAAAAACAT2dnUwAEAAAAAAAAAADqnjMlAgAAADzQPmcBAQA=");
	if (mpeg) canPlayThrough("audio/mpeg;base64,/+MYxAAAAANIAUAAAASEEB/jwOFM/0MM/90b/+RhST//w4NFwOjf///PZu////9lns5GFDv//l9GlUIEEIAAAgIg8Ir/JGq3/+MYxDsLIj5QMYcoAP0dv9HIjUcH//yYSg+CIbkGP//8w0bLVjUP///3Z0x5QCAv/yLjwtGKTEFNRTMuOTeqqqqqqqqqqqqq/+MYxEkNmdJkUYc4AKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq");
	// lets find out!
	var time = (new Date()).getTime(); 
	var interval = window.setInterval(function() {
		for (var key in supports) {}
		var now = (new Date()).getTime();
		var maxExecution = now - time > 5000;
		if (key || maxExecution) {
			window.clearInterval(interval);
			callback(supports);
		}
	}, 1);
};

})();/*

	MIDI.loadPlugin(callback, type);
	-------------------------------------
	https://github.com/mudx/MIDI.js
	-------------------------------------

*/

if (typeof (MIDI) === "undefined") var MIDI = {};
if (typeof (MIDI.Soundfont) === "undefined") MIDI.Soundfont = {};

(function() { "use strict";

var plugins = { "#webaudio": true, "#html5": true, "#java": true, "#flash": true };

MIDI.loadPlugin = function(callback, instrument) {
	var type;
  var loader = window.loader;
	var instrument = instrument || "";
	MIDI.audioDetect(function(types) {
		// use the most appropriate plugin if not specified
		if (typeof(type) === 'undefined') {
			if (plugins[window.location.hash]) {
				type = window.location.hash;
			} else {
				type = "";
			}
		}
        if (type === "") {
            var isSafari = navigator.userAgent.toLowerCase().indexOf("safari") !== -1;
            if (window.webkitAudioContext) { // Chrome
                type = "#webaudio";
            } else if (window.Audio) { // Firefox
                type = "#html5";
            } else { // Safari and Internet Explorer
                type = "#flash";
            }
        }
		// use audio/ogg when supported
		var filetype = types["audio/ogg"] ? "ogg" : "mp3";
    var filesize = (filetype === "ogg" ? 3958964 : 3152665);
		// load the specified plugin
		switch (type) {
			case "#java":
				// works well cross-browser, and highly featured, but required Java machine to startup
				if (loader) loader.message("Soundfont (500KB)<br>Java Interface...");
				MIDI.Java.connect(callback);
				break;
			case "#flash":
				// fairly quick, but requires loading of individual MP3s
				if (loader) loader.message("Soundfont (2MB)<br>Flash Interface...");
				DOMLoader.script.add({
					src: "./inc/SoundManager2/script/soundmanager2-jsmin.js",
					verify: "SoundManager",
					callback: function () {
						MIDI.Flash.connect(callback);
					}
				});
				break;
			case "#html5":
				// works well in Firefox
				DOMLoader.sendRequest({
					url: "./soundfont/soundfont-" + filetype + ".js",
					callback: function (response) {
						MIDI.Soundfont = JSON.parse(response.responseText);
						MIDI.HTML5.connect(callback);
					}, 
					progress: function (evt) {
						var percent = Math.round(evt.loaded / filesize * 100);
						if (loader) loader.message("Downloading: " + (percent + "%"));
					}
				});
				break;
			case "#webaudio":
				// works well in Chrome
				DOMLoader.sendRequest({
					url: "./soundfont/soundfont-" + filetype + instrument + ".js",
					callback: function(response) {
						MIDI.Soundfont = JSON.parse(response.responseText);
						MIDI.WebAudioAPI.connect(callback);
					}, 
					progress: function (evt) {
						var percent = Math.round(evt.loaded / filesize * 100);
						if (loader) loader.message("Downloading: " + (percent + "%"));
					}
				});
				break;
			default:
				break;
		}
	});
};

})();
/*

	MIDI.Plugin : 0.3
	-------------------------------------
	https://github.com/mudx/MIDI.js
	-------------------------------------
	MIDI.WebAudioAPI
	MIDI.Flash
	MIDI.HTML5
	MIDI.instruments
	MIDI.channels
	MIDI.keyToNote
	MIDI.noteToKey
	
	setMute?
	getInstruments?

*/

if (typeof (MIDI) === "undefined") var MIDI = {};
if (typeof (MIDI.Plugin) === "undefined") MIDI.Plugin = {};

(function() { "use strict";

/*
	Web Audio API - OGG or MPEG Soundbank
	--------------------------------------
	https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html
*/

if (typeof (MIDI.WebAudioAPI) === "undefined") MIDI.WebAudioAPI = {};

if (window.AudioContext || window.webkitAudioContext) (function () {

	var AudioContext = window.AudioContext || window.webkitAudioContext;
	var root = MIDI.WebAudioAPI;
	var ctx;
	var sources = {};
	var masterVolume = 1;
	var audioBuffers = {};
	var audioLoader = function (urlList, index, bufferList, oncomplete) {
		var url = urlList[index];
		var base64 = MIDI.Soundfont[url].split(",")[1];
		var buffer = Base64Binary.decodeArrayBuffer(base64);
		ctx.decodeAudioData(buffer, function (buffer) {
			var msg = url; while(msg.length < 3) msg += "&nbsp;";
			if (typeof(loader) !== "undefined") {
				loader.message("Processing: "+(index/87 * 100 >> 0)+"%<br>");
			}
			buffer.id = url;
			bufferList[index] = buffer;
			//
			if (bufferList.length === urlList.length) {
				while (bufferList.length) {
					buffer = bufferList.pop();
					var nodeId = MIDI.keyToNote[buffer.id];
					audioBuffers[nodeId] = buffer;
				}
				oncomplete();
			}
		});
	};

	root.setVolume = function (n) {
		masterVolume = n;
	};

	root.programChange = function (instrument) {

	};

	root.noteOn = function (channel, note, velocity, delay) {
		/// check whether the note exists
		if (!audioBuffers[note]) return;
		/// convert relative delay to absolute delay
		if (delay < ctx.currentTime) delay += ctx.currentTime;
		/// crate audio buffer
		var source = ctx.createBufferSource();
		sources[channel + "" + note] = source;
		source.buffer = audioBuffers[note];
		source.connect(ctx.destination);
		//
		var gainNode = ctx.createGainNode();
		var value = -0.5 + (velocity / 100) * 2;
		var minus = (1 - masterVolume) * 2;
		gainNode.connect(ctx.destination);
		gainNode.gain.value = Math.max(-1, value - minus);
		source.connect(gainNode);
		//
//		source.playbackRate.value = 2;
		///
		source.noteOn(delay || 0);
		return source;
	};

	root.chordOn = function (channel, chord, velocity, delay) {
		var ret = {}, note;
		for (var n = 0, length = chord.length; n < length; n ++) {
			ret[note = chord[n]] = root.noteOn(channel, note, velocity, delay);
		}
		return ret;
	};

	// FIX: needs some way to fade out smoothly..
	root.noteOff = function (channel, note, delay) {
//		var source = sources[channel+""+note];
//		if (!source) return;
//		source.noteOff(delay || 0);
//		return source;
	};

	root.chordOff = function (channel, chord, delay) {

	};

	root.connect = function (callback) {
	
		MIDI.lang = 'WebAudioAPI';
		MIDI.setVolume = root.setVolume;
		MIDI.programChange = root.programChange;
		MIDI.noteOn = root.noteOn;
		MIDI.noteOff = root.noteOff;
		MIDI.chordOn = root.chordOn;
		MIDI.chordOff = root.chordOff;
		//
		MIDI.Player.ctx = ctx = new AudioContext();
		///
		var urlList = [];
		var keyToNote = MIDI.keyToNote;
		for (var key in keyToNote) urlList.push(key);
		var bufferList = [];
		for (var i = 0; i < urlList.length; i++) {
			audioLoader(urlList, i, bufferList, callback);
		}
	};

})();

/*
	HTML5 <audio> - OGG or MPEG Soundbank
	--------------------------------------
	http://dev.w3.org/html5/spec/Overview.html#the-audio-element
*/

if (window.Audio) (function () {

	var root = MIDI.HTML5 = {};
	var note2id = {};
	var volume = 1; // floating point 
	var channel_nid = -1; // current channel
	var channel_map = {}; // map to current playing <audio> elements
	var channels = []; // the audio channels
	var notes = {}; // the piano keys
	for (var nid = 0; nid < 12; nid++) {
		channels[nid] = new Audio();
	}

	var playChannel = function (id) {
		var note = notes[id];
		if (!note) return;
		var nid = (channel_nid + 1) % channels.length;
		var time = (new Date()).getTime();
		var audio = channels[nid];
		channel_map[note.id] = audio;
		audio.src = MIDI.Soundfont[note.id];
		audio.volume = volume;
		audio.play();
		channel_nid = nid;
	};

	root.programChange = function () {

	};
	
	root.setVolume = function (n) {
		volume = n;
	};
	
	root.noteOn = function (channel, note, velocity, delay) {
		var id = note2id[note];
		if (!notes[id]) return;
		if (delay) {
			var interval = window.setTimeout(function() { 
				playChannel(id); 
			}, delay * 1000);
			return interval;
		} else {
			playChannel(id);
		}
	};
	root.noteOff = function (channel, note, delay) {
//		var nid = note2id[note];
//		channel_map[nid].pause();
	};
	root.chordOn = function (channel, chord, velocity, delay) {
		for (var key in chord) {
			var n = chord[key];
			var id = note2id[n];
			if (!notes[id]) continue;
			playChannel(id);
		}
	};
	root.chordOff = function (channel, chord, delay) {

	};
	root.stopAllNotes = function () {
		for (var nid = 0, length = channels.length; nid < length; nid++) {
			channels[nid].pause();
		}
	};
	root.connect = function (callback) {
		var loading = {};
		for (var key in MIDI.keyToNote) {
			note2id[MIDI.keyToNote[key]] = key;
			notes[key] = {
				id: key
			};
		}
		MIDI.lang = 'HTML5';
		MIDI.setVolume = root.setVolume;
		MIDI.programChange = root.programChange;
		MIDI.noteOn = root.noteOn;
		MIDI.noteOff = root.noteOff;
		MIDI.chordOn = root.chordOn;
		MIDI.chordOff = root.chordOff;
		//
		if (callback) callback();
		//
	};
})();

/*
	Flash - MP3 Soundbank
	----------------------
	http://www.schillmania.com/projects/soundmanager2/
	
*/
	
(function () {

	var root = MIDI.Flash = {};
	var noteReverse = {};
	var notes = {};
	root.programChange = function () {

	};
	root.setVolume = function (channel, note) {

	};
	root.noteOn = function (channel, note, velocity, delay) {
		var id = noteReverse[note];
		if (!notes[id]) return;
		if (delay) {
			var interval = window.setTimeout(function() { 
				notes[id].play({ volume: velocity * 2 });
			}, delay * 1000);
			return interval;
		} else {
			notes[id].play({ volume: velocity * 2 });
		}
	};
	root.noteOff = function (channel, note, delay) {

	};
	root.chordOn = function (channel, chord, velocity, delay) {
		for (var key in chord) {
			var n = chord[key];
			var id = noteReverse[n];
			if (notes[id]) {
				notes[id].play({ volume: velocity * 2 });
			}
		}
	};
	root.chordOff = function (channel, chord, delay) {

	};
	root.stopAllNotes = function () {

	};
	root.connect = function (callback) {
		soundManager.flashVersion = 9;
		soundManager.useHTML5Audio = true;
		soundManager.url = '../../swf/';
		soundManager.useHighPerformance = true;
		soundManager.wmode = 'transparent';
		soundManager.flashPollingInterval = 1;
		soundManager.debugMode = false;
		soundManager.onload = function () {
			var loaded = [];
			var onload = function () {
				loaded.push(this.sID);
				if (typeof (loader) === "undefined") return;
				loader.message("Processing: " + this.sID);
			};
			for (var i = 10; i < 65 + 10; i++) {
				var id = noteReverse[i + 26];
				notes[id] = soundManager.createSound({
					id: id,
					url: './soundfont/mp3/' + id + '.mp3',
					multiShot: true,
					autoLoad: true,
					onload: onload
				});
			}
			MIDI.lang = 'Flash';
			MIDI.setVolume = root.setVolume;
			MIDI.programChange = root.programChange;
			MIDI.noteOn = root.noteOn;
			MIDI.noteOff = root.noteOff;
			MIDI.chordOn = root.chordOn;
			MIDI.chordOff = root.chordOff;
			//
			var interval = window.setInterval(function () {
				if (loaded.length !== 65) return;
				window.clearInterval(interval);
				if (callback) callback();
			}, 25);
		};
		soundManager.onerror = function () {

		};
		for (var key in MIDI.keyToNote) {
			noteReverse[MIDI.keyToNote[key]] = key;
		}
	};
})();

/*
	Java - Native Soundbank
	----------------------------
	https://github.com/abudaan/midibridge-js
	http://java.sun.com/products/java-media/sound/soundbanks.html	
*/

(function () {
	var root = MIDI.Java = {};
	root.connect = function (callback) {
		// deferred loading of <applet>
		MIDI.Plugin = false;
		if (!window.navigator.javaEnabled()) {
			MIDI.Flash.connect(callback);
			return;
		}
		MIDI.Java.callback = callback;
		var iframe = document.createElement('iframe');
		iframe.name = 'MIDIFrame';
		iframe.src = 'inc/midibridge/index.html';
		iframe.width = 1;
		iframe.height = 1;
		document.body.appendChild(iframe);
	};
	root.confirm = function (plugin) {
		MIDI.programChange = function (program) {
			plugin.sendMidiEvent(0xC0, 0, program, 0);
		};
		MIDI.setVolume = function (n) {
			
		};
		MIDI.noteOn = function (channel, note, velocity, delay) {
			if (delay) {
				var interval = window.setTimeout(function() { 
					plugin.sendMidiEvent(0x90, channel, note, velocity);
				}, delay * 1000);
				return interval;
			} else {
				plugin.sendMidiEvent(0x90, channel, note, velocity);
			}
		};
		MIDI.noteOff = function (channel, note, delay) {
			if (delay) {
				var interval = window.setTimeout(function() { 
					plugin.sendMidiEvent(0x80, channel, note, 0);
				}, delay * 1000);
				return interval;
			} else {
				plugin.sendMidiEvent(0x80, channel, note, 0);
			}
		};
		MIDI.chordOn = function (channel, chord, velocity, delay) {
			for (var key in chord) {
				var n = chord[key];
				plugin.sendMidiEvent(0x90, channel, n, 100);
			}
		};
		MIDI.chordOff = function (channel, chord, delay) {
			for (var key in chord) {
				var n = chord[key];
				plugin.sendMidiEvent(0x80, channel, n, 100);
			}
		};
		MIDI.stopAllNotes = function () {

		};
		MIDI.getInstruments = function() {
			return [];
		};
		///
		if (plugin.ready) {
			MIDI.lang = "Java";
			if (MIDI.Java.callback) {
				MIDI.Java.callback();
			}
		} else {
			MIDI.Flash.connect(MIDI.Java.callback);
		}
	};
})();

/*
	helper functions
*/

// instrument-tracker
MIDI.instruments = (function (arr) {
	var instruments = {};
	for (var key in arr) {
		var list = arr[key];
		for (var n = 0, length = list.length; n < length; n++) {
			var instrument = list[n];
			if (!instrument) continue;
			var num = parseInt(instrument.substr(0, instrument.indexOf(" ")), 10);
			instrument = instrument.replace(num + " ", "");
			instruments[--num] = {
				instrument: instrument,
				category: key
			};
			instruments[instrument] = {
				number: num,
				category: key
			};
		}
	}
	return instruments;
})({
	'Piano': ['1 Acoustic Grand Piano', '2 Bright Acoustic Piano', '3 Electric Grand Piano', '4 Honky-tonk Piano', '5 Electric Piano 1', '6 Electric Piano 2', '7 Harpsichord', '8 Clavinet'],
	'Chromatic Percussion': ['9 Celesta', '10 Glockenspiel', '11 Music Box', '12 Vibraphone', '13 Marimba', '14 Xylophone', '15 Tubular Bells', '16 Dulcimer'],
	'Organ': ['17 Drawbar Organ', '18 Percussive Organ', '19 Rock Organ', '20 Church Organ', '21 Reed Organ', '22 Accordion', '23 Harmonica', '24 Tango Accordion'],
	'Guitar': ['25 Acoustic Guitar (nylon)', '26 Acoustic Guitar (steel)', '27 Electric Guitar (jazz)', '28 Electric Guitar (clean)', '29 Electric Guitar (muted)', '30 Overdriven Guitar', '31 Distortion Guitar', '32 Guitar Harmonics'],
	'Bass': ['33 Acoustic Bass', '34 Electric Bass (finger)', '35 Electric Bass (pick)', '36 Fretless Bass', '37 Slap Bass 1', '38 Slap Bass 2', '39 Synth Bass 1', '40 Synth Bass 2'],
	'Strings': ['41 Violin', '42 Viola', '43 Cello', '44 Contrabass', '45 Tremolo Strings', '46 Pizzicato Strings', '47 Orchestral Harp', '48 Timpani'],
	'Ensemble': ['49 String Ensemble 1', '50 String Ensemble 2', '51 Synth Strings 1', '52 Synth Strings 2', '53 Choir Aahs', '54 Voice Oohs', '55 Synth Choir', '56 Orchestra Hit'],
	'Brass': ['57 Trumpet', '58 Trombone', '59 Tuba', '60 Muted Trumpet', '61 French Horn', '62 Brass Section', '63 Synth Brass 1', '64 Synth Brass 2'],
	'Reed': ['65 Soprano Sax', '66 Alto Sax', '67 Tenor Sax', '68 Baritone Sax', '69 Oboe', '70 English Horn', '71 Bassoon', '72 Clarinet'],
	'Pipe': ['73 Piccolo', '74 Flute', '75 Recorder', '76 Pan Flute', '77 Blown Bottle', '78 Shakuhachi', '79 Whistle', '80 Ocarina'],
	'Synth Lead': ['81 Lead 1 (square)', '82 Lead 2 (sawtooth)', '83 Lead 3 (calliope)', '84 Lead 4 (chiff)', '85 Lead 5 (charang)', '86 Lead 6 (voice)', '87 Lead 7 (fifths)', '88 Lead 8 (bass + lead)'],
	'Synth Pad': ['89 Pad 1 (new age)', '90 Pad 2 (warm)', '91 Pad 3 (polysynth)', '92 Pad 4 (choir)', '93 Pad 5 (bowed)', '94 Pad 6 (metallic)', '95 Pad 7 (halo)', '96 Pad 8 (sweep)'],
	'Synth Effects': ['97 FX 1 (rain)', '98 FX 2 (soundtrack)', '99 FX 3 (crystal)', '100 FX 4 (atmosphere)', '101 FX 5 (brightness)', '102 FX 6 (goblins)', '103 FX 7 (echoes)', '104 FX 8 (sci-fi)'],
	'Ethnic': ['105 Sitar', '106 Banjo', '107 Shamisen', '108 Koto', '109 Kalimba', '110 Bagpipe', '111 Fiddle', '112 Shanai'],
	'Percussive': ['113 Tinkle Bell', '114 Agogo', '115 Steel Drums', '116 Woodblock', '117 Taiko Drum', '118 Melodic Tom', '119 Synth Drum'],
	'Sound effects': ['120 Reverse Cymbal', '121 Guitar Fret Noise', '122 Breath Noise', '123 Seashore', '124 Bird Tweet', '125 Telephone Ring', '126 Helicopter', '127 Applause', '128 Gunshot']
});

// channel-tracker
MIDI.channels = (function () { // 0 - 15 channels
	var channels = {};
	for (var n = 0; n < 16; n++) {
		channels[n] = { // default values
			instrument: 0,
			// Acoustic Grand Piano
			mute: false,
			mono: false,
			omni: false,
			solo: false
		};
	}
	return channels;
})();

// note conversions
MIDI.keyToNote = {}; // C8  == 108
MIDI.noteToKey = {}; // 108 ==  C8
(function () {
	var A0 = 0x15; // first note
	var C8 = 0x6C; // last note
	var number2key = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
	for (var n = A0; n <= C8; n++) {
		var octave = (n - 12) / 12 >> 0;
		var name = number2key[n % 12] + octave;
		MIDI.keyToNote[name] = n;
		MIDI.noteToKey[n] = name;
	}
})();

})();

MIDI.pianoKeyOffset = 21;
/*
	
	MIDI.Player : 0.3
	-------------------------------------
	https://github.com/mudx/MIDI.js
	-------------------------------------
	requires jasmid
	
*/

if (typeof (MIDI) === "undefined") var MIDI = {};
if (typeof (MIDI.Player) === "undefined") MIDI.Player = {};

(function() { "use strict";

var root = MIDI.Player;
root.callback = undefined; // your custom callback goes here!
root.currentTime = 0;
root.endTime = 0; 
root.restart = 0; 
root.playing = false;
root.timeWarp = 1;

//
root.start =
root.resume = function () {
	if (root.currentTime < -1) root.currentTime = -1;
	startAudio(root.currentTime);
};

root.pause = function () {
	var tmp = root.restart;
	stopAudio();
	root.restart = tmp;
};

root.stop = function () {
	stopAudio();
	root.restart = 0;
	root.currentTime = 0;
};

root.addListener = function(callback) {
	onMidiEvent = callback;
};

root.removeListener = function() {
	onMidiEvent = undefined;
};

root.clearAnimation = function() {
	if (root.interval)  {
		window.clearInterval(root.interval);
	}
};

root.setAnimation = function(config) {
	var callback = (typeof(config) === "function") ? config : config.callback;
	var delay = config.delay || 100;
	var currentTime = 0;
	var tOurTime = 0;
	var tTheirTime = 0;
	//
	root.clearAnimation();
	root.interval = window.setInterval(function (){
		if (root.endTime === 0) return;
		if (root.playing) {
			currentTime = (tTheirTime == root.currentTime) ? tOurTime-(new Date()).getTime() : 0;
			if (root.currentTime === 0) {
				currentTime = 0;
			} else {
				currentTime = root.currentTime - currentTime;
			}
			if (tTheirTime != root.currentTime) {
				tOurTime = (new Date()).getTime();
				tTheirTime = root.currentTime;
			}
		} else { // paused
			currentTime = root.currentTime;
		}
		var endTime = root.endTime;
		var percent = currentTime / endTime;
		var total = currentTime / 1000;
		var minutes = total / 60;
		var seconds = total - (minutes * 60);
		var t1 = minutes * 60 + seconds;
		var t2 = (endTime / 1000);
		if (t2 - t1 < -1) return;
		callback({
			now: t1,
			end: t2,
			events: noteRegistrar
		});
	}, delay);
};

// helpers

var loadMidiFile = function() { // reads midi into javascript array of events
	root.replayer = new Replayer(MidiFile(root.currentData), root.timeWarp);
	root.data = root.replayer.getData();
	root.endTime = getLength();
};

root.loadFile = function (file, callback) {
	root.stop();
	if (file.indexOf("base64,") !== -1) {
		var data = window.atob(file.split(",")[1]);
		root.currentData = data;
		loadMidiFile();
		if (callback) callback(data);
		return;
	}
	var fetch = new XMLHttpRequest();
	fetch.open('GET', file);
	fetch.overrideMimeType("text/plain; charset=x-user-defined");
	fetch.onreadystatechange = function () {
		if (this.readyState === 4 && this.status === 200) {
			var t = this.responseText || "";
			var ff = [];
			var mx = t.length;
			var scc = String.fromCharCode;
			for (var z = 0; z < mx; z++) {
				ff[z] = scc(t.charCodeAt(z) & 255);
			}
			var data = window.atob(ff.join(""));
			root.currentData = data;
			loadMidiFile();
			if (callback) callback(data);
		}
	};
	fetch.send();
};

// Playing the audio

var eventQueue = []; // hold events to be triggered
var queuedTime; // 
var startTime = 0; // to measure time elapse
var noteRegistrar = {}; // get event for requested note
var onMidiEvent = undefined; // listener callback
var scheduleTracking = function (channel, note, currentTime, offset, message, velocity) {
	var interval = window.setInterval(function () {
		window.clearInterval(interval);
		var data = {
			channel: channel,
			note: note,
			now: currentTime,
			end: root.endTime,
			message: message,
			velocity: velocity
		};
		//
		if (message === 128) {
			delete noteRegistrar[note];
		} else {
			noteRegistrar[note] = data;
		}
		if (onMidiEvent) {
			onMidiEvent(data);
		}
		root.currentTime = currentTime;
		if (root.currentTime === queuedTime && queuedTime < root.endTime) { // grab next sequence
			startAudio(queuedTime, true);
		}
	}, currentTime - offset);
	return interval;
};

var getContext = function() {
	if (MIDI.lang === 'WebAudioAPI') {
		return MIDI.Player.ctx;
	} else if (!root.ctx) {
		root.ctx = { currentTime: 0 };
	}
	return root.ctx;
};

var getLength = function() {
	var data =  root.data;
	var length = data.length;
	var totalTime = 0.5;
	for (var n = 0; n < length; n++) {
		totalTime += data[n][1];
	}
	return totalTime;
};

var startAudio = function (currentTime, fromCache) {
	if (!root.replayer) return;
	if (!fromCache) {
		if (typeof (currentTime) === "undefined") currentTime = root.restart;
		if (root.playing) stopAudio();
		root.playing = true;
		root.data = root.replayer.getData();
		root.endTime = getLength();
	}
	var note;
	var offset = 0;
	var messages = 0;
	var data = root.data;	
	var ctx = getContext();
	var length = data.length;
	//
	queuedTime = 0.5;
	startTime = ctx.currentTime;
	//
	for (var n = 0; n < length && messages < 100; n++) {
		queuedTime += data[n][1];
		if (queuedTime <= currentTime) {
			offset = queuedTime;
			continue;
		}
		currentTime = queuedTime - offset;
		var event = data[n][0].event;
		if (event.type !== "channel") continue;
		var channel = event.channel;
		switch (event.subtype) {
			case 'noteOn':
				if (MIDI.channels[channel].mute) break;
				note = event.noteNumber - (root.MIDIOffset || 0);
				eventQueue.push({
					event: event,
					source: MIDI.noteOn(channel, event.noteNumber, event.velocity, currentTime / 1000 + ctx.currentTime),
					interval: scheduleTracking(channel, note, queuedTime, offset, 144, event.velocity)
				});
				messages ++;
				break;
			case 'noteOff':
				if (MIDI.channels[channel].mute) break;
				note = event.noteNumber - (root.MIDIOffset || 0);
				eventQueue.push({
					event: event,
					source: MIDI.noteOff(channel, event.noteNumber, currentTime / 1000 + ctx.currentTime),
					interval: scheduleTracking(channel, note, queuedTime, offset - 10, 128)
				});
				break;
			default:
				break;
		}
	}
};

var stopAudio = function () {
	var ctx = getContext();
	root.playing = false;
	root.restart += (ctx.currentTime - startTime) * 1000;
	// stop the audio, and intervals
	while (eventQueue.length) {
		var o = eventQueue.pop();
		window.clearInterval(o.interval);
		if (!o.source) continue; // is not webaudio
		if (typeof(o.source) === "number") {
			window.clearTimeout(o.source);
		} else { // webaudio
			var source = o.source;
			source.disconnect(0);
			source.noteOff(0);
		}
	}
	// run callback to cancel any notes still playing
	for (var key in noteRegistrar) {
		var o = noteRegistrar[key]
		if (noteRegistrar[key].message === 144 && onMidiEvent) {
			onMidiEvent({
				channel: o.channel,
				note: o.note,
				now: o.now,
				end: o.end,
				message: 128,
				velocity: o.velocity
			});
		}
	}
	// reset noteRegistrar
	noteRegistrar = {};
};

})();/*

	Color.Space : 0.3 : mudcu.be
	-----------------------------
	STRING <-> HEX <-> RGB <-> HSL
	-----------------------------
	var HEX = 0xFF0000;
	var HSL = Color.Space(HEX, "HEX>RGB>HSL");
	
*/

if (!window.Color) Color = {};
if (!window.Color.Space) Color.Space = {};

(function () {

var DEG_RAD = Math.PI / 180;
var RAD_DEG = 1 / DEG_RAD;

var shortcuts = { };
var root = Color.Space = function(color, route) {
	if (shortcuts[route]) {
		route = shortcuts[route];
	}
	var arr = route.split(">");
	var key = "";
	for (var n = 0; n < arr.length; n ++) {
		if (n > 1) {
			key = key.split("_");
			key.shift();
			key = key.join("_");
		}
		key += (n == 0 ? "" : "_") + arr[n];
		if (n > 0) color = root[key](color);
	}
	return color;
};

// STRING = 'FFFFFF' | 'FFFFFFFF'

root.STRING_HEX = function (o) {
	return parseInt('0x' + o);
};

// HEX = 0x000000 -> 0xFFFFFF

root.HEX_STRING = function (o, maxLength) {
	if (!maxLength) maxLength = 6;
	if (!o) o = 0;
	var z = o.toString(16);
	// when string is lesser than maxLength
	var n = z.length;
	while (n < maxLength) {
		z = '0' + z;
		n++;
	}
	// when string is greater than maxLength
	var n = z.length;
	while (n > maxLength) {
		z = z.substr(1);
		n--;
	}
	return z;
};

root.HEX_RGB = function (o) {
	return {
		R: (o >> 16),
		G: (o >> 8) & 0xFF,
		B: o & 0xFF
	};
};

// RGB = R: Red / G: Green / B: Blue

root.RGB_HEX = function (o) {
	if (o.R < 0) o.R = 0;
	if (o.G < 0) o.G = 0;
	if (o.B < 0) o.B = 0;
	if (o.R > 255) o.R = 255;
	if (o.G > 255) o.G = 255;
	if (o.B > 255) o.B = 255;
	return o.R << 16 | o.G << 8 | o.B;
};

root.RGB_HSL = function (o) { // RGB from 0 to 1
	// http://www.easyrgb.com/index.php?X=MATH&H=18#text18
	var _R = o.R / 255,
		_G = o.G / 255,
		_B = o.B / 255,
		min = Math.min(_R, _G, _B),
		max = Math.max(_R, _G, _B),
		D = max - min,
		H,
		S,
		L = (max + min) / 2;
	if (D == 0) { // No chroma
			H = 0;
			S = 0;
	} else { // Chromatic data
		if (L < 0.5) S = D / (max + min);
		else S = D / (2 - max - min);
		var DR = (((max - _R) / 6) + (D / 2)) / D;
		var DG = (((max - _G) / 6) + (D / 2)) / D;
		var DB = (((max - _B) / 6) + (D / 2)) / D;
		if (_R == max) H = DB - DG;
		else if (_G == max) H = (1 / 3) + DR - DB;
		else if (_B == max) H = (2 / 3) + DG - DR;
		if (H < 0) H += 1;
		if (H > 1) H -= 1;
	}
	return {
		H: H * 360,
		S: S * 100,
		L: L * 100
	};
};

// HSL (1978) = H: Hue / S: Saturation / L: Lightess

root.HSL_RGB = function (o) {
	// http://www.easyrgb.com/index.php?X=MATH&H=19
	var H = o.H / 360,
		S = o.S / 100,
		L = o.L / 100,
		R, G, B, _1, _2;
	function Hue_2_RGB(v1, v2, vH) {
		if (vH < 0) vH += 1;
		if (vH > 1) vH -= 1;
		if ((6 * vH) < 1) return v1 + (v2 - v1) * 6 * vH;
		if ((2 * vH) < 1) return v2;
		if ((3 * vH) < 2) return v1 + (v2 - v1) * ((2 / 3) - vH) * 6;
		return v1;
	}
	if (S == 0) { // HSL from 0 to 1
		R = L * 255;
		G = L * 255;
		B = L * 255;
	} else {
		if (L < 0.5) _2 = L * (1 + S);
		else _2 = (L + S) - (S * L);
		_1 = 2 * L - _2;
		R = 255 * Hue_2_RGB(_1, _2, H + (1 / 3));
		G = 255 * Hue_2_RGB(_1, _2, H);
		B = 255 * Hue_2_RGB(_1, _2, H - (1 / 3));
	}
	return {
		R: R,
		G: G,
		B: B
	};
};

})();var invertObject = function (o) {
	if (o.length) {
		var ret = {};
		for (var key = 0; key < o.length; key ++) {
			ret[o[key]] = key; 
		}
	} else {
		var ret = {};
		for (var key in o) {
			ret[o[key]] = key; 
		}
	}
	return ret;
};

if (typeof(MusicTheory) === "undefined") MusicTheory = {};

(function() {

	var root = MusicTheory;
	
	// KEY SIGNATURES
		
	root.key2number = {
		'A': 0,
		'A#': 1,
		'Bb': 1,
		'B': 2,
		'C': 3,
		'C#': 4,
		'Db': 4,
		'D': 5,
		'D#': 6,
		'Eb': 6,
		'E': 7,
		'F': 8,
		'F#': 9,
		'Gb': 9,
		'G': 10,
		'G#': 11,
		'Ab': 11
	};
	
	root.number2float = {
		0: 0,
		1: 0.5,
		2: 1,
		3: 2,
		4: 2.5,
		5: 3,
		6: 3.5,
		7: 4,
		8: 5,
		9: 5.5,
		10: 6,
		11: 6.5,
		12: 7
	};
	
	root.number2key = invertObject(root.key2number);
	root.float2number = invertObject(root.number2float);
	
	root.getKeySignature = function (key) {
		var keys = [ 'A', 'AB', 'B', 'C', 'CD', 'D', 'DE', 'E', 'F', 'FG', 'G', 'GA' ];
		var accidental = [ 'F', 'C', 'G', 'D', 'A', 'E', 'B' ];
		var signature = { // key signatures
				'Fb': -8,
				'Cb': -7,
				'Gb': -6,
				'Db': -5,
				'Ab': -4,
				'Eb': -3,
				'Bb': -2,
				'F': -1,
				'C': 0,
				'G': 1,
				'D': 2,
				'A': 3,
				'E': 4,
				'B': 5,
				'F#': 6,
				'C#': 7,
				'G#': 8,
				'D#': 9,
				'A#': 10,
				'E#': 11,
				'B#': 12
			}[key];
		if(signature < 0) { // flat
			accidental = accidental.splice(7 + signature, -signature).reverse().join('');
		} else { // sharp
			accidental = accidental.splice(0, signature).join('');
		}
		for(var i = 0; i < keys.length; i ++) {
			if (keys[i].length > 1) {
				if (accidental.indexOf(keys[i][0]) != -1 || accidental.indexOf(keys[i][1]) != -1) {
					if (signature > 0) {
						keys[i] = keys[i][0] + '#';
					} else {
						keys[i] = keys[i][1] + 'b';
					}
				} else {
					keys[i] = keys[i][0] + '#';
				}
			}
		};
		Piano.keySignature = keys;
	};
	
	//// TEMPO
	
	root.tempoFromTap = function(that) {
		function getName(v) {
			var tempo = { // wikipedia
				200: 'Prestissimo',
				168: 'Presto',
				140: 'Vivace',
				120: 'Allegro',
				112: 'Allegretto',
				101: 'Moderato',
				76: 'Andante',
				66: 'Adagio',
				60: 'Larghetto',
				40: 'Lento',
				0: 'Larghissimo'
			};
			for (var n = 0, name = ""; n < 250; n ++) {
				if (tempo[n]) name = tempo[n];
				if (v < n) return name;
			}
			return 'Prestissimo';
		};
		if (that.tap) {
			var diff = (new Date()).getTime() - that.tap;
			var c = 1 / (diff / 1000) * 60;
			Piano.tempo = c;
			console.log(getName(c), c, diff)
			document.getElementById("taptap").value = (c>>0) +"bmp " + getName(c);
		}
		that.tap = (new Date()).getTime();
	}; 
	
	//// CHORD FINDER
	
	root.findChord = function(r) {
		function rewrite(o) {
			var z = {};
			for (var i in o) {
				var r = {};
				for (var ii in o[i]) {
					r[o[i][ii]] = 1;
				}
				z[i] = r;
			}
			return z;
		};
		var test = {};
		var values = "0 3".split(' ');
		var chords = rewrite(Piano.chords);
		for (var key in chords) {
			for (var n = 0, length = values.length; n < length; n ++) {
				if (isNaN(chords[key][values[n]])) {
					test[key] = 1;
					break;
				}
			}
		}
		var results = [];
		for (var key in chords) {
			if (!test[key]) results.push(key);
		}
		document.getElementById("find").value = results;
		return results;
	}; 
	
	///// CHORD INFORMATION
	
	root.scaleInfo = function(o) {
		var intervalNames = [ 'r', 'b2', '2', 'b3', '3', '4', 'b5', '5', '&#X266F;5', '6', 'b7', '7', '8', 'b9', '9', '&#X266F;9', '10', '11', 'b12', '12', '&#X266F;12', '13' ]; // Interval numbers
		var notes = '',
			intervals = '',
			gaps = '',
			solfege = '',
	//		colors = '',
			keys = '';
		for (var i in o) {
			if (o[i] > 0) {
				gaps += '-' + (o[i] - key);
			}
			var key = o[i];
			var note = Piano.calculateNote(key) % 12;
			var noteName = Piano.keySignature[note];
			var color = Piano.Color[Piano.HSL].english[note];
			solfege += ', ' + MusicTheory.Solfege[noteName].syllable;
	//		colors += ', ' + (color[0] ? color[0].toUpperCase() + color.substr(1) : 'Undefined');
			keys += ', ' + key;
			notes += ', ' + noteName;
			intervals += ', ' + intervalNames[key];
		}
		console.log(
			'<b>notes:</b> ' + notes.substr(2) + '<br>' +
			'<b>solfege:</b> ' + solfege.substr(2) + '<br>' +
			'<b>intervals:</b> ' + intervals.substr(2) + '<br>' +
			'<b>keys:</b> ' + keys.substr(2) + '<br>' +
			'<b>gaps:</b> ' + gaps.substr(1)
		);
	};

})();/*

	MusicTheory.Synesthesia : 0.3
	------------------------------------------------------------
	Peacock:  “Instruments to perform color-music: Two centuries of technological experimentation,” Leonardo, 21 (1988), 397-406.
	Gerstner:  Karl Gerstner, The Forms of Color 1986
	Klein:  Colour-Music: The art of light, London: Crosby Lockwood and Son, 1927.
	Jameson:  “Visual music in a visual programming language,” IEEE Symposium on Visual Languages, 1999, 111-118. 
	Helmholtz:  Treatise on Physiological Optics, New York: Dover Books, 1962 
	Jones:  The art of light & color, New York: Van Nostrand Reinhold, 1972
	------------------------------------------------------------
	Reference: http://rhythmiclight.com/archives/ideas/colorscales.html

*/

if (typeof(MusicTheory) === "undefined") var MusicTheory = {};
if (typeof(MusicTheory.Synesthesia) === "undefined") MusicTheory.Synesthesia = {};

(function(root) {
	root.data = {
		'Isaac Newton (1704)': { 
			ref: "Gerstner, p.167",
			english: ['red',null,'orange',null,'yellow','green',null,'blue',null,'indigo',null,'violet'],
			0: [ 0, 96, 51 ], // C
			1: [ 0, 0, 0 ], // C#
			2: [ 29, 94, 52 ], // D
			3: [ 0, 0, 0 ], // D#
			4: [ 60, 90, 60 ], // E
			5: [ 135, 76, 32 ], // F
			6: [ 0, 0, 0 ], // F#
			7: [ 248, 82, 28 ], // G
			8: [ 0, 0, 0 ], // G#
			9: [ 302, 88, 26 ], // A
			10: [ 0, 0, 0 ], // A#
			11: [ 325, 84, 46 ] // B
		},
		'Louis Bertrand Castel (1734)': { 
			ref: 'Peacock, p.400',
			english: ['blue','blue-green','green','olive green','yellow','yellow-orange','orange','red','crimson','violet','agate','indigo'],
			0: [ 248, 82, 28 ],
			1: [ 172, 68, 34 ],
			2: [ 135, 76, 32 ],
			3: [ 79, 59, 36 ],
			4: [ 60, 90, 60 ],
			5: [ 49, 90, 60 ],
			6: [ 29, 94, 52 ],
			7: [ 360, 96, 51 ],
			8: [ 1, 89, 33 ],
			9: [ 325, 84, 46 ],
			10: [ 273, 80, 27 ],
			11: [ 302, 88, 26 ]
		},
		'George Field (1816)': { 
			ref: 'Klein, p.69',
			english: ['blue',null,'purple',null,'red','orange',null,'yellow',null,'yellow green',null,'green'],
			0: [ 248, 82, 28 ],
			1: [ 0, 0, 0 ],
			2: [ 302, 88, 26 ],
			3: [ 0, 0, 0 ],
			4: [ 360, 96, 51 ],
			5: [ 29, 94, 52 ],
			6: [ 0, 0, 0 ],
			7: [ 60, 90, 60 ],
			8: [ 0, 0, 0 ],
			9: [ 79, 59, 36 ],
			10: [ 0, 0, 0 ],
			11: [ 135, 76, 32 ]
		},
		'D. D. Jameson (1844)': { 
			ref: 'Jameson, p.12',
			english: ['red','red-orange','orange','orange-yellow','yellow','green','green-blue','blue','blue-purple','purple','purple-violet','violet'],
			0: [ 360, 96, 51 ],
			1: [ 14, 91, 51 ],
			2: [ 29, 94, 52 ],
			3: [ 49, 90, 60 ],
			4: [ 60, 90, 60 ],
			5: [ 135, 76, 32 ],
			6: [ 172, 68, 34 ],
			7: [ 248, 82, 28 ],
			8: [ 273, 80, 27 ],
			9: [ 302, 88, 26 ],
			10: [ 313, 78, 37 ],
			11: [ 325, 84, 46 ]
		},
		'Theodor Seemann (1881)': { 
			ref: 'Klein, p.86',
			english: ['carmine','scarlet','orange','yellow-orange','yellow','green','green blue','blue','indigo','violet','brown','black'],
			0: [ 0, 58, 26 ],
			1: [ 360, 96, 51 ],
			2: [ 29, 94, 52 ],
			3: [ 49, 90, 60 ],
			4: [ 60, 90, 60 ],
			5: [ 135, 76, 32 ],
			6: [ 172, 68, 34 ],
			7: [ 248, 82, 28 ],
			8: [ 302, 88, 26 ],
			9: [ 325, 84, 46 ],
			10: [ 0, 58, 26 ],
			11: [ 0, 0, 3 ]
		},
		'A. Wallace Rimington (1893)': { 
			ref: 'Peacock, p.402',
			english: ['deep red','crimson','orange-crimson','orange','yellow','yellow-green','green','blueish green','blue-green','indigo','deep blue','violet'],
			0: [ 360, 96, 51 ],
			1: [ 1, 89, 33 ],
			2: [ 14, 91, 51 ],
			3: [ 29, 94, 52 ],
			4: [ 60, 90, 60 ],
			5: [ 79, 59, 36 ],
			6: [ 135, 76, 32 ],
			7: [ 163, 62, 40 ],
			8: [ 172, 68, 34 ],
			9: [ 302, 88, 26 ],
			10: [ 248, 82, 28 ],
			11: [ 325, 84, 46 ]
		},
		'Bainbridge Bishop (1893)': { 
			ref: 'Bishop, p.11',
			english: ['red','orange-red or scarlet','orange','gold or yellow-orange','yellow or green-gold','yellow-green','green','greenish-blue or aquamarine','blue','indigo or violet-blue','violet','violet-red','red'],
			0: [ 360, 96, 51 ],
			1: [ 1, 89, 33 ],
			2: [ 29, 94, 52 ],
			3: [ 50, 93, 52 ],
			4: [ 60, 90, 60 ],
			5: [ 73, 73, 55 ],
			6: [ 135, 76, 32 ],
			7: [ 163, 62, 40 ],
			8: [ 302, 88, 26 ],
			9: [ 325, 84, 46 ],
			10: [ 343, 79, 47 ],
			11: [ 360, 96, 51 ]
		},
		'H. von Helmholtz (1910)': { 
			ref: 'Helmholtz, p.22',
			english: ['yellow','green','greenish blue','cayan-blue','indigo blue','violet','end of red','red','red','red','red orange','orange'],
			0: [ 60, 90, 60 ],
			1: [ 135, 76, 32 ],
			2: [ 172, 68, 34 ],
			3: [ 211, 70, 37 ],
			4: [ 302, 88, 26 ],
			5: [ 325, 84, 46 ],
			6: [ 330, 84, 34 ],
			7: [ 360, 96, 51 ],
			8: [ 10, 91, 43 ],
			9: [ 10, 91, 43 ],
			10: [ 8, 93, 51 ],
			11: [ 28, 89, 50 ]
		},
		'Alexander Scriabin (1911)': { 
			ref: 'Jones, p.104',
			english: ['red','violet','yellow','steely with the glint of metal','pearly blue the shimmer of moonshine','dark red','bright blue','rosy orange','purple','green','steely with a glint of metal','pearly blue the shimmer of moonshine'],
			0: [ 360, 96, 51 ],
			1: [ 325, 84, 46 ],
			2: [ 60, 90, 60 ],
			3: [ 245, 21, 43 ],
			4: [ 211, 70, 37 ],
			5: [ 1, 89, 33 ],
			6: [ 248, 82, 28 ],
			7: [ 29, 94, 52 ],
			8: [ 302, 88, 26 ],
			9: [ 135, 76, 32 ],
			10: [ 245, 21, 43 ],
			11: [ 211, 70, 37 ]
		},
		'Adrian Bernard Klein (1930)': { 
			ref: 'Klein, p.209',
			english: ['dark red','red','red orange','orange','yellow','yellow green','green','blue-green','blue','blue violet','violet','dark violet'],
			0: [ 0, 91, 40 ],
			1: [ 360, 96, 51 ],
			2: [ 14, 91, 51 ],
			3: [ 29, 94, 52 ],
			4: [ 60, 90, 60 ],
			5: [ 73, 73, 55 ],
			6: [ 135, 76, 32 ],
			7: [ 172, 68, 34 ],
			8: [ 248, 82, 28 ],
			9: [ 292, 70, 31 ],
			10: [ 325, 84, 46 ],
			11: [ 330, 84, 34 ]
		},
		'August Aeppli (1940)': { 
			ref: 'Gerstner, p.169',
			english: ['red',null,'orange',null,'yellow',null,'green','blue-green',null,'ultramarine blue','violet','purple'],
			0: [ 0, 96, 51 ],
			1: [ 0, 0, 0 ],
			2: [ 29, 94, 52 ],
			3: [ 0, 0, 0 ],
			4: [ 60, 90, 60 ],
			5: [ 0, 0, 0 ],
			6: [ 135, 76, 32 ],
			7: [ 172, 68, 34 ],
			8: [ 0, 0, 0 ],
			9: [ 211, 70, 37 ],
			10: [ 273, 80, 27 ],
			11: [ 302, 88, 26 ]
		},
		'I. J. Belmont (1944)': { 
			ref: 'Belmont, p.226',
			english: ['red','red-orange','orange','yellow-orange','yellow','yellow-green','green','blue-green','blue','blue-violet','violet','red-violet'],
			0: [ 360, 96, 51 ],
			1: [ 14, 91, 51 ],
			2: [ 29, 94, 52 ],
			3: [ 50, 93, 52 ],
			4: [ 60, 90, 60 ],
			5: [ 73, 73, 55 ],
			6: [ 135, 76, 32 ],
			7: [ 172, 68, 34 ],
			8: [ 248, 82, 28 ],
			9: [ 313, 78, 37 ],
			10: [ 325, 84, 46 ],
			11: [ 338, 85, 37 ]
		},
		'Steve Zieverink (2004)': { 
			ref: 'Cincinnati Contemporary Art Center',
			english: ['yellow-green','green','blue-green','blue','indigo','violet','ultra violet','infra red','red','orange','yellow-white','yellow'],
			0: [ 73, 73, 55 ],
			1: [ 135, 76, 32 ],
			2: [ 172, 68, 34 ],
			3: [ 248, 82, 28 ],
			4: [ 302, 88, 26 ],
			5: [ 325, 84, 46 ],
			6: [ 326, 79, 24 ],
			7: [ 1, 89, 33 ],
			8: [ 360, 96, 51 ],
			9: [ 29, 94, 52 ],
			10: [ 62, 78, 74 ],
			11: [ 60, 90, 60 ]
		}
	};

	root.map = function(type) {
		var data = {};
		var blend = function(a, b) {
			return [ // blend two colors and round results
				(a[0] * 0.5 + b[0] * 0.5 + 0.5) >> 0, 
				(a[1] * 0.5 + b[1] * 0.5 + 0.5) >> 0,
				(a[2] * 0.5 + b[2] * 0.5 + 0.5) >> 0
			];
		};
		var syn = root.data;
		var colors = syn[type] || syn["D. D. Jameson (1844)"];
		for (var note = 0; note <= 88; note ++) { // creates mapping for 88 notes
			var clr = colors[(note + 9) % 12];
			if (clr[0] == clr[1] && clr[1] == clr[2]) {
				clr = blend(parray, colors[(note + 10) % 12]);
			}		
			var amount = clr[2] / 10;
			var octave = note / 12 >> 0;
			var octaveLum = clr[2] + amount * octave - 3 * amount; // map luminance to octave		
			data[note] = {
				hsl: 'hsla(' + clr[0] + ',' + clr[1] + '%,' + octaveLum + '%, 1)',
				hex: Color.Space({H:clr[0], S:clr[1], L:octaveLum}, "HSL>RGB>HEX>STRING")
			};
			var parray = clr;
		}
		return data;
	};

})(MusicTheory.Synesthesia);/*! jQuery v1.7.1 jquery.com | jquery.org/license */
(function(a,b){function cy(a){return f.isWindow(a)?a:a.nodeType===9?a.defaultView||a.parentWindow:!1}function cv(a){if(!ck[a]){var b=c.body,d=f("<"+a+">").appendTo(b),e=d.css("display");d.remove();if(e==="none"||e===""){cl||(cl=c.createElement("iframe"),cl.frameBorder=cl.width=cl.height=0),b.appendChild(cl);if(!cm||!cl.createElement)cm=(cl.contentWindow||cl.contentDocument).document,cm.write((c.compatMode==="CSS1Compat"?"<!doctype html>":"")+"<html><body>"),cm.close();d=cm.createElement(a),cm.body.appendChild(d),e=f.css(d,"display"),b.removeChild(cl)}ck[a]=e}return ck[a]}function cu(a,b){var c={};f.each(cq.concat.apply([],cq.slice(0,b)),function(){c[this]=a});return c}function ct(){cr=b}function cs(){setTimeout(ct,0);return cr=f.now()}function cj(){try{return new a.ActiveXObject("Microsoft.XMLHTTP")}catch(b){}}function ci(){try{return new a.XMLHttpRequest}catch(b){}}function cc(a,c){a.dataFilter&&(c=a.dataFilter(c,a.dataType));var d=a.dataTypes,e={},g,h,i=d.length,j,k=d[0],l,m,n,o,p;for(g=1;g<i;g++){if(g===1)for(h in a.converters)typeof h=="string"&&(e[h.toLowerCase()]=a.converters[h]);l=k,k=d[g];if(k==="*")k=l;else if(l!=="*"&&l!==k){m=l+" "+k,n=e[m]||e["* "+k];if(!n){p=b;for(o in e){j=o.split(" ");if(j[0]===l||j[0]==="*"){p=e[j[1]+" "+k];if(p){o=e[o],o===!0?n=p:p===!0&&(n=o);break}}}}!n&&!p&&f.error("No conversion from "+m.replace(" "," to ")),n!==!0&&(c=n?n(c):p(o(c)))}}return c}function cb(a,c,d){var e=a.contents,f=a.dataTypes,g=a.responseFields,h,i,j,k;for(i in g)i in d&&(c[g[i]]=d[i]);while(f[0]==="*")f.shift(),h===b&&(h=a.mimeType||c.getResponseHeader("content-type"));if(h)for(i in e)if(e[i]&&e[i].test(h)){f.unshift(i);break}if(f[0]in d)j=f[0];else{for(i in d){if(!f[0]||a.converters[i+" "+f[0]]){j=i;break}k||(k=i)}j=j||k}if(j){j!==f[0]&&f.unshift(j);return d[j]}}function ca(a,b,c,d){if(f.isArray(b))f.each(b,function(b,e){c||bE.test(a)?d(a,e):ca(a+"["+(typeof e=="object"||f.isArray(e)?b:"")+"]",e,c,d)});else if(!c&&b!=null&&typeof b=="object")for(var e in b)ca(a+"["+e+"]",b[e],c,d);else d(a,b)}function b_(a,c){var d,e,g=f.ajaxSettings.flatOptions||{};for(d in c)c[d]!==b&&((g[d]?a:e||(e={}))[d]=c[d]);e&&f.extend(!0,a,e)}function b$(a,c,d,e,f,g){f=f||c.dataTypes[0],g=g||{},g[f]=!0;var h=a[f],i=0,j=h?h.length:0,k=a===bT,l;for(;i<j&&(k||!l);i++)l=h[i](c,d,e),typeof l=="string"&&(!k||g[l]?l=b:(c.dataTypes.unshift(l),l=b$(a,c,d,e,l,g)));(k||!l)&&!g["*"]&&(l=b$(a,c,d,e,"*",g));return l}function bZ(a){return function(b,c){typeof b!="string"&&(c=b,b="*");if(f.isFunction(c)){var d=b.toLowerCase().split(bP),e=0,g=d.length,h,i,j;for(;e<g;e++)h=d[e],j=/^\+/.test(h),j&&(h=h.substr(1)||"*"),i=a[h]=a[h]||[],i[j?"unshift":"push"](c)}}}function bC(a,b,c){var d=b==="width"?a.offsetWidth:a.offsetHeight,e=b==="width"?bx:by,g=0,h=e.length;if(d>0){if(c!=="border")for(;g<h;g++)c||(d-=parseFloat(f.css(a,"padding"+e[g]))||0),c==="margin"?d+=parseFloat(f.css(a,c+e[g]))||0:d-=parseFloat(f.css(a,"border"+e[g]+"Width"))||0;return d+"px"}d=bz(a,b,b);if(d<0||d==null)d=a.style[b]||0;d=parseFloat(d)||0;if(c)for(;g<h;g++)d+=parseFloat(f.css(a,"padding"+e[g]))||0,c!=="padding"&&(d+=parseFloat(f.css(a,"border"+e[g]+"Width"))||0),c==="margin"&&(d+=parseFloat(f.css(a,c+e[g]))||0);return d+"px"}function bp(a,b){b.src?f.ajax({url:b.src,async:!1,dataType:"script"}):f.globalEval((b.text||b.textContent||b.innerHTML||"").replace(bf,"/*$0*/")),b.parentNode&&b.parentNode.removeChild(b)}function bo(a){var b=c.createElement("div");bh.appendChild(b),b.innerHTML=a.outerHTML;return b.firstChild}function bn(a){var b=(a.nodeName||"").toLowerCase();b==="input"?bm(a):b!=="script"&&typeof a.getElementsByTagName!="undefined"&&f.grep(a.getElementsByTagName("input"),bm)}function bm(a){if(a.type==="checkbox"||a.type==="radio")a.defaultChecked=a.checked}function bl(a){return typeof a.getElementsByTagName!="undefined"?a.getElementsByTagName("*"):typeof a.querySelectorAll!="undefined"?a.querySelectorAll("*"):[]}function bk(a,b){var c;if(b.nodeType===1){b.clearAttributes&&b.clearAttributes(),b.mergeAttributes&&b.mergeAttributes(a),c=b.nodeName.toLowerCase();if(c==="object")b.outerHTML=a.outerHTML;else if(c!=="input"||a.type!=="checkbox"&&a.type!=="radio"){if(c==="option")b.selected=a.defaultSelected;else if(c==="input"||c==="textarea")b.defaultValue=a.defaultValue}else a.checked&&(b.defaultChecked=b.checked=a.checked),b.value!==a.value&&(b.value=a.value);b.removeAttribute(f.expando)}}function bj(a,b){if(b.nodeType===1&&!!f.hasData(a)){var c,d,e,g=f._data(a),h=f._data(b,g),i=g.events;if(i){delete h.handle,h.events={};for(c in i)for(d=0,e=i[c].length;d<e;d++)f.event.add(b,c+(i[c][d].namespace?".":"")+i[c][d].namespace,i[c][d],i[c][d].data)}h.data&&(h.data=f.extend({},h.data))}}function bi(a,b){return f.nodeName(a,"table")?a.getElementsByTagName("tbody")[0]||a.appendChild(a.ownerDocument.createElement("tbody")):a}function U(a){var b=V.split("|"),c=a.createDocumentFragment();if(c.createElement)while(b.length)c.createElement(b.pop());return c}function T(a,b,c){b=b||0;if(f.isFunction(b))return f.grep(a,function(a,d){var e=!!b.call(a,d,a);return e===c});if(b.nodeType)return f.grep(a,function(a,d){return a===b===c});if(typeof b=="string"){var d=f.grep(a,function(a){return a.nodeType===1});if(O.test(b))return f.filter(b,d,!c);b=f.filter(b,d)}return f.grep(a,function(a,d){return f.inArray(a,b)>=0===c})}function S(a){return!a||!a.parentNode||a.parentNode.nodeType===11}function K(){return!0}function J(){return!1}function n(a,b,c){var d=b+"defer",e=b+"queue",g=b+"mark",h=f._data(a,d);h&&(c==="queue"||!f._data(a,e))&&(c==="mark"||!f._data(a,g))&&setTimeout(function(){!f._data(a,e)&&!f._data(a,g)&&(f.removeData(a,d,!0),h.fire())},0)}function m(a){for(var b in a){if(b==="data"&&f.isEmptyObject(a[b]))continue;if(b!=="toJSON")return!1}return!0}function l(a,c,d){if(d===b&&a.nodeType===1){var e="data-"+c.replace(k,"-$1").toLowerCase();d=a.getAttribute(e);if(typeof d=="string"){try{d=d==="true"?!0:d==="false"?!1:d==="null"?null:f.isNumeric(d)?parseFloat(d):j.test(d)?f.parseJSON(d):d}catch(g){}f.data(a,c,d)}else d=b}return d}function h(a){var b=g[a]={},c,d;a=a.split(/\s+/);for(c=0,d=a.length;c<d;c++)b[a[c]]=!0;return b}var c=a.document,d=a.navigator,e=a.location,f=function(){function J(){if(!e.isReady){try{c.documentElement.doScroll("left")}catch(a){setTimeout(J,1);return}e.ready()}}var e=function(a,b){return new e.fn.init(a,b,h)},f=a.jQuery,g=a.$,h,i=/^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,j=/\S/,k=/^\s+/,l=/\s+$/,m=/^<(\w+)\s*\/?>(?:<\/\1>)?$/,n=/^[\],:{}\s]*$/,o=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,p=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,q=/(?:^|:|,)(?:\s*\[)+/g,r=/(webkit)[ \/]([\w.]+)/,s=/(opera)(?:.*version)?[ \/]([\w.]+)/,t=/(msie) ([\w.]+)/,u=/(mozilla)(?:.*? rv:([\w.]+))?/,v=/-([a-z]|[0-9])/ig,w=/^-ms-/,x=function(a,b){return(b+"").toUpperCase()},y=d.userAgent,z,A,B,C=Object.prototype.toString,D=Object.prototype.hasOwnProperty,E=Array.prototype.push,F=Array.prototype.slice,G=String.prototype.trim,H=Array.prototype.indexOf,I={};e.fn=e.prototype={constructor:e,init:function(a,d,f){var g,h,j,k;if(!a)return this;if(a.nodeType){this.context=this[0]=a,this.length=1;return this}if(a==="body"&&!d&&c.body){this.context=c,this[0]=c.body,this.selector=a,this.length=1;return this}if(typeof a=="string"){a.charAt(0)!=="<"||a.charAt(a.length-1)!==">"||a.length<3?g=i.exec(a):g=[null,a,null];if(g&&(g[1]||!d)){if(g[1]){d=d instanceof e?d[0]:d,k=d?d.ownerDocument||d:c,j=m.exec(a),j?e.isPlainObject(d)?(a=[c.createElement(j[1])],e.fn.attr.call(a,d,!0)):a=[k.createElement(j[1])]:(j=e.buildFragment([g[1]],[k]),a=(j.cacheable?e.clone(j.fragment):j.fragment).childNodes);return e.merge(this,a)}h=c.getElementById(g[2]);if(h&&h.parentNode){if(h.id!==g[2])return f.find(a);this.length=1,this[0]=h}this.context=c,this.selector=a;return this}return!d||d.jquery?(d||f).find(a):this.constructor(d).find(a)}if(e.isFunction(a))return f.ready(a);a.selector!==b&&(this.selector=a.selector,this.context=a.context);return e.makeArray(a,this)},selector:"",jquery:"1.7.1",length:0,size:function(){return this.length},toArray:function(){return F.call(this,0)},get:function(a){return a==null?this.toArray():a<0?this[this.length+a]:this[a]},pushStack:function(a,b,c){var d=this.constructor();e.isArray(a)?E.apply(d,a):e.merge(d,a),d.prevObject=this,d.context=this.context,b==="find"?d.selector=this.selector+(this.selector?" ":"")+c:b&&(d.selector=this.selector+"."+b+"("+c+")");return d},each:function(a,b){return e.each(this,a,b)},ready:function(a){e.bindReady(),A.add(a);return this},eq:function(a){a=+a;return a===-1?this.slice(a):this.slice(a,a+1)},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},slice:function(){return this.pushStack(F.apply(this,arguments),"slice",F.call(arguments).join(","))},map:function(a){return this.pushStack(e.map(this,function(b,c){return a.call(b,c,b)}))},end:function(){return this.prevObject||this.constructor(null)},push:E,sort:[].sort,splice:[].splice},e.fn.init.prototype=e.fn,e.extend=e.fn.extend=function(){var a,c,d,f,g,h,i=arguments[0]||{},j=1,k=arguments.length,l=!1;typeof i=="boolean"&&(l=i,i=arguments[1]||{},j=2),typeof i!="object"&&!e.isFunction(i)&&(i={}),k===j&&(i=this,--j);for(;j<k;j++)if((a=arguments[j])!=null)for(c in a){d=i[c],f=a[c];if(i===f)continue;l&&f&&(e.isPlainObject(f)||(g=e.isArray(f)))?(g?(g=!1,h=d&&e.isArray(d)?d:[]):h=d&&e.isPlainObject(d)?d:{},i[c]=e.extend(l,h,f)):f!==b&&(i[c]=f)}return i},e.extend({noConflict:function(b){a.$===e&&(a.$=g),b&&a.jQuery===e&&(a.jQuery=f);return e},isReady:!1,readyWait:1,holdReady:function(a){a?e.readyWait++:e.ready(!0)},ready:function(a){if(a===!0&&!--e.readyWait||a!==!0&&!e.isReady){if(!c.body)return setTimeout(e.ready,1);e.isReady=!0;if(a!==!0&&--e.readyWait>0)return;A.fireWith(c,[e]),e.fn.trigger&&e(c).trigger("ready").off("ready")}},bindReady:function(){if(!A){A=e.Callbacks("once memory");if(c.readyState==="complete")return setTimeout(e.ready,1);if(c.addEventListener)c.addEventListener("DOMContentLoaded",B,!1),a.addEventListener("load",e.ready,!1);else if(c.attachEvent){c.attachEvent("onreadystatechange",B),a.attachEvent("onload",e.ready);var b=!1;try{b=a.frameElement==null}catch(d){}c.documentElement.doScroll&&b&&J()}}},isFunction:function(a){return e.type(a)==="function"},isArray:Array.isArray||function(a){return e.type(a)==="array"},isWindow:function(a){return a&&typeof a=="object"&&"setInterval"in a},isNumeric:function(a){return!isNaN(parseFloat(a))&&isFinite(a)},type:function(a){return a==null?String(a):I[C.call(a)]||"object"},isPlainObject:function(a){if(!a||e.type(a)!=="object"||a.nodeType||e.isWindow(a))return!1;try{if(a.constructor&&!D.call(a,"constructor")&&!D.call(a.constructor.prototype,"isPrototypeOf"))return!1}catch(c){return!1}var d;for(d in a);return d===b||D.call(a,d)},isEmptyObject:function(a){for(var b in a)return!1;return!0},error:function(a){throw new Error(a)},parseJSON:function(b){if(typeof b!="string"||!b)return null;b=e.trim(b);if(a.JSON&&a.JSON.parse)return a.JSON.parse(b);if(n.test(b.replace(o,"@").replace(p,"]").replace(q,"")))return(new Function("return "+b))();e.error("Invalid JSON: "+b)},parseXML:function(c){var d,f;try{a.DOMParser?(f=new DOMParser,d=f.parseFromString(c,"text/xml")):(d=new ActiveXObject("Microsoft.XMLDOM"),d.async="false",d.loadXML(c))}catch(g){d=b}(!d||!d.documentElement||d.getElementsByTagName("parsererror").length)&&e.error("Invalid XML: "+c);return d},noop:function(){},globalEval:function(b){b&&j.test(b)&&(a.execScript||function(b){a.eval.call(a,b)})(b)},camelCase:function(a){return a.replace(w,"ms-").replace(v,x)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toUpperCase()===b.toUpperCase()},each:function(a,c,d){var f,g=0,h=a.length,i=h===b||e.isFunction(a);if(d){if(i){for(f in a)if(c.apply(a[f],d)===!1)break}else for(;g<h;)if(c.apply(a[g++],d)===!1)break}else if(i){for(f in a)if(c.call(a[f],f,a[f])===!1)break}else for(;g<h;)if(c.call(a[g],g,a[g++])===!1)break;return a},trim:G?function(a){return a==null?"":G.call(a)}:function(a){return a==null?"":(a+"").replace(k,"").replace(l,"")},makeArray:function(a,b){var c=b||[];if(a!=null){var d=e.type(a);a.length==null||d==="string"||d==="function"||d==="regexp"||e.isWindow(a)?E.call(c,a):e.merge(c,a)}return c},inArray:function(a,b,c){var d;if(b){if(H)return H.call(b,a,c);d=b.length,c=c?c<0?Math.max(0,d+c):c:0;for(;c<d;c++)if(c in b&&b[c]===a)return c}return-1},merge:function(a,c){var d=a.length,e=0;if(typeof c.length=="number")for(var f=c.length;e<f;e++)a[d++]=c[e];else while(c[e]!==b)a[d++]=c[e++];a.length=d;return a},grep:function(a,b,c){var d=[],e;c=!!c;for(var f=0,g=a.length;f<g;f++)e=!!b(a[f],f),c!==e&&d.push(a[f]);return d},map:function(a,c,d){var f,g,h=[],i=0,j=a.length,k=a instanceof e||j!==b&&typeof j=="number"&&(j>0&&a[0]&&a[j-1]||j===0||e.isArray(a));if(k)for(;i<j;i++)f=c(a[i],i,d),f!=null&&(h[h.length]=f);else for(g in a)f=c(a[g],g,d),f!=null&&(h[h.length]=f);return h.concat.apply([],h)},guid:1,proxy:function(a,c){if(typeof c=="string"){var d=a[c];c=a,a=d}if(!e.isFunction(a))return b;var f=F.call(arguments,2),g=function(){return a.apply(c,f.concat(F.call(arguments)))};g.guid=a.guid=a.guid||g.guid||e.guid++;return g},access:function(a,c,d,f,g,h){var i=a.length;if(typeof c=="object"){for(var j in c)e.access(a,j,c[j],f,g,d);return a}if(d!==b){f=!h&&f&&e.isFunction(d);for(var k=0;k<i;k++)g(a[k],c,f?d.call(a[k],k,g(a[k],c)):d,h);return a}return i?g(a[0],c):b},now:function(){return(new Date).getTime()},uaMatch:function(a){a=a.toLowerCase();var b=r.exec(a)||s.exec(a)||t.exec(a)||a.indexOf("compatible")<0&&u.exec(a)||[];return{browser:b[1]||"",version:b[2]||"0"}},sub:function(){function a(b,c){return new a.fn.init(b,c)}e.extend(!0,a,this),a.superclass=this,a.fn=a.prototype=this(),a.fn.constructor=a,a.sub=this.sub,a.fn.init=function(d,f){f&&f instanceof e&&!(f instanceof a)&&(f=a(f));return e.fn.init.call(this,d,f,b)},a.fn.init.prototype=a.fn;var b=a(c);return a},browser:{}}),e.each("Boolean Number String Function Array Date RegExp Object".split(" "),function(a,b){I["[object "+b+"]"]=b.toLowerCase()}),z=e.uaMatch(y),z.browser&&(e.browser[z.browser]=!0,e.browser.version=z.version),e.browser.webkit&&(e.browser.safari=!0),j.test(" ")&&(k=/^[\s\xA0]+/,l=/[\s\xA0]+$/),h=e(c),c.addEventListener?B=function(){c.removeEventListener("DOMContentLoaded",B,!1),e.ready()}:c.attachEvent&&(B=function(){c.readyState==="complete"&&(c.detachEvent("onreadystatechange",B),e.ready())});return e}(),g={};f.Callbacks=function(a){a=a?g[a]||h(a):{};var c=[],d=[],e,i,j,k,l,m=function(b){var d,e,g,h,i;for(d=0,e=b.length;d<e;d++)g=b[d],h=f.type(g),h==="array"?m(g):h==="function"&&(!a.unique||!o.has(g))&&c.push(g)},n=function(b,f){f=f||[],e=!a.memory||[b,f],i=!0,l=j||0,j=0,k=c.length;for(;c&&l<k;l++)if(c[l].apply(b,f)===!1&&a.stopOnFalse){e=!0;break}i=!1,c&&(a.once?e===!0?o.disable():c=[]:d&&d.length&&(e=d.shift(),o.fireWith(e[0],e[1])))},o={add:function(){if(c){var a=c.length;m(arguments),i?k=c.length:e&&e!==!0&&(j=a,n(e[0],e[1]))}return this},remove:function(){if(c){var b=arguments,d=0,e=b.length;for(;d<e;d++)for(var f=0;f<c.length;f++)if(b[d]===c[f]){i&&f<=k&&(k--,f<=l&&l--),c.splice(f--,1);if(a.unique)break}}return this},has:function(a){if(c){var b=0,d=c.length;for(;b<d;b++)if(a===c[b])return!0}return!1},empty:function(){c=[];return this},disable:function(){c=d=e=b;return this},disabled:function(){return!c},lock:function(){d=b,(!e||e===!0)&&o.disable();return this},locked:function(){return!d},fireWith:function(b,c){d&&(i?a.once||d.push([b,c]):(!a.once||!e)&&n(b,c));return this},fire:function(){o.fireWith(this,arguments);return this},fired:function(){return!!e}};return o};var i=[].slice;f.extend({Deferred:function(a){var b=f.Callbacks("once memory"),c=f.Callbacks("once memory"),d=f.Callbacks("memory"),e="pending",g={resolve:b,reject:c,notify:d},h={done:b.add,fail:c.add,progress:d.add,state:function(){return e},isResolved:b.fired,isRejected:c.fired,then:function(a,b,c){i.done(a).fail(b).progress(c);return this},always:function(){i.done.apply(i,arguments).fail.apply(i,arguments);return this},pipe:function(a,b,c){return f.Deferred(function(d){f.each({done:[a,"resolve"],fail:[b,"reject"],progress:[c,"notify"]},function(a,b){var c=b[0],e=b[1],g;f.isFunction(c)?i[a](function(){g=c.apply(this,arguments),g&&f.isFunction(g.promise)?g.promise().then(d.resolve,d.reject,d.notify):d[e+"With"](this===i?d:this,[g])}):i[a](d[e])})}).promise()},promise:function(a){if(a==null)a=h;else for(var b in h)a[b]=h[b];return a}},i=h.promise({}),j;for(j in g)i[j]=g[j].fire,i[j+"With"]=g[j].fireWith;i.done(function(){e="resolved"},c.disable,d.lock).fail(function(){e="rejected"},b.disable,d.lock),a&&a.call(i,i);return i},when:function(a){function m(a){return function(b){e[a]=arguments.length>1?i.call(arguments,0):b,j.notifyWith(k,e)}}function l(a){return function(c){b[a]=arguments.length>1?i.call(arguments,0):c,--g||j.resolveWith(j,b)}}var b=i.call(arguments,0),c=0,d=b.length,e=Array(d),g=d,h=d,j=d<=1&&a&&f.isFunction(a.promise)?a:f.Deferred(),k=j.promise();if(d>1){for(;c<d;c++)b[c]&&b[c].promise&&f.isFunction(b[c].promise)?b[c].promise().then(l(c),j.reject,m(c)):--g;g||j.resolveWith(j,b)}else j!==a&&j.resolveWith(j,d?[a]:[]);return k}}),f.support=function(){var b,d,e,g,h,i,j,k,l,m,n,o,p,q=c.createElement("div"),r=c.documentElement;q.setAttribute("className","t"),q.innerHTML="   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>",d=q.getElementsByTagName("*"),e=q.getElementsByTagName("a")[0];if(!d||!d.length||!e)return{};g=c.createElement("select"),h=g.appendChild(c.createElement("option")),i=q.getElementsByTagName("input")[0],b={leadingWhitespace:q.firstChild.nodeType===3,tbody:!q.getElementsByTagName("tbody").length,htmlSerialize:!!q.getElementsByTagName("link").length,style:/top/.test(e.getAttribute("style")),hrefNormalized:e.getAttribute("href")==="/a",opacity:/^0.55/.test(e.style.opacity),cssFloat:!!e.style.cssFloat,checkOn:i.value==="on",optSelected:h.selected,getSetAttribute:q.className!=="t",enctype:!!c.createElement("form").enctype,html5Clone:c.createElement("nav").cloneNode(!0).outerHTML!=="<:nav></:nav>",submitBubbles:!0,changeBubbles:!0,focusinBubbles:!1,deleteExpando:!0,noCloneEvent:!0,inlineBlockNeedsLayout:!1,shrinkWrapBlocks:!1,reliableMarginRight:!0},i.checked=!0,b.noCloneChecked=i.cloneNode(!0).checked,g.disabled=!0,b.optDisabled=!h.disabled;try{delete q.test}catch(s){b.deleteExpando=!1}!q.addEventListener&&q.attachEvent&&q.fireEvent&&(q.attachEvent("onclick",function(){b.noCloneEvent=!1}),q.cloneNode(!0).fireEvent("onclick")),i=c.createElement("input"),i.value="t",i.setAttribute("type","radio"),b.radioValue=i.value==="t",i.setAttribute("checked","checked"),q.appendChild(i),k=c.createDocumentFragment(),k.appendChild(q.lastChild),b.checkClone=k.cloneNode(!0).cloneNode(!0).lastChild.checked,b.appendChecked=i.checked,k.removeChild(i),k.appendChild(q),q.innerHTML="",a.getComputedStyle&&(j=c.createElement("div"),j.style.width="0",j.style.marginRight="0",q.style.width="2px",q.appendChild(j),b.reliableMarginRight=(parseInt((a.getComputedStyle(j,null)||{marginRight:0}).marginRight,10)||0)===0);if(q.attachEvent)for(o in{submit:1,change:1,focusin:1})n="on"+o,p=n in q,p||(q.setAttribute(n,"return;"),p=typeof q[n]=="function"),b[o+"Bubbles"]=p;k.removeChild(q),k=g=h=j=q=i=null,f(function(){var a,d,e,g,h,i,j,k,m,n,o,r=c.getElementsByTagName("body")[0];!r||(j=1,k="position:absolute;top:0;left:0;width:1px;height:1px;margin:0;",m="visibility:hidden;border:0;",n="style='"+k+"border:5px solid #000;padding:0;'",o="<div "+n+"><div></div></div>"+"<table "+n+" cellpadding='0' cellspacing='0'>"+"<tr><td></td></tr></table>",a=c.createElement("div"),a.style.cssText=m+"width:0;height:0;position:static;top:0;margin-top:"+j+"px",r.insertBefore(a,r.firstChild),q=c.createElement("div"),a.appendChild(q),q.innerHTML="<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>",l=q.getElementsByTagName("td"),p=l[0].offsetHeight===0,l[0].style.display="",l[1].style.display="none",b.reliableHiddenOffsets=p&&l[0].offsetHeight===0,q.innerHTML="",q.style.width=q.style.paddingLeft="1px",f.boxModel=b.boxModel=q.offsetWidth===2,typeof q.style.zoom!="undefined"&&(q.style.display="inline",q.style.zoom=1,b.inlineBlockNeedsLayout=q.offsetWidth===2,q.style.display="",q.innerHTML="<div style='width:4px;'></div>",b.shrinkWrapBlocks=q.offsetWidth!==2),q.style.cssText=k+m,q.innerHTML=o,d=q.firstChild,e=d.firstChild,h=d.nextSibling.firstChild.firstChild,i={doesNotAddBorder:e.offsetTop!==5,doesAddBorderForTableAndCells:h.offsetTop===5},e.style.position="fixed",e.style.top="20px",i.fixedPosition=e.offsetTop===20||e.offsetTop===15,e.style.position=e.style.top="",d.style.overflow="hidden",d.style.position="relative",i.subtractsBorderForOverflowNotVisible=e.offsetTop===-5,i.doesNotIncludeMarginInBodyOffset=r.offsetTop!==j,r.removeChild(a),q=a=null,f.extend(b,i))});return b}();var j=/^(?:\{.*\}|\[.*\])$/,k=/([A-Z])/g;f.extend({cache:{},uuid:0,expando:"jQuery"+(f.fn.jquery+Math.random()).replace(/\D/g,""),noData:{embed:!0,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",applet:!0},hasData:function(a){a=a.nodeType?f.cache[a[f.expando]]:a[f.expando];return!!a&&!m(a)},data:function(a,c,d,e){if(!!f.acceptData(a)){var g,h,i,j=f.expando,k=typeof c=="string",l=a.nodeType,m=l?f.cache:a,n=l?a[j]:a[j]&&j,o=c==="events";if((!n||!m[n]||!o&&!e&&!m[n].data)&&k&&d===b)return;n||(l?a[j]=n=++f.uuid:n=j),m[n]||(m[n]={},l||(m[n].toJSON=f.noop));if(typeof c=="object"||typeof c=="function")e?m[n]=f.extend(m[n],c):m[n].data=f.extend(m[n].data,c);g=h=m[n],e||(h.data||(h.data={}),h=h.data),d!==b&&(h[f.camelCase(c)]=d);if(o&&!h[c])return g.events;k?(i=h[c],i==null&&(i=h[f.camelCase(c)])):i=h;return i}},removeData:function(a,b,c){if(!!f.acceptData(a)){var d,e,g,h=f.expando,i=a.nodeType,j=i?f.cache:a,k=i?a[h]:h;if(!j[k])return;if(b){d=c?j[k]:j[k].data;if(d){f.isArray(b)||(b in d?b=[b]:(b=f.camelCase(b),b in d?b=[b]:b=b.split(" ")));for(e=0,g=b.length;e<g;e++)delete d[b[e]];if(!(c?m:f.isEmptyObject)(d))return}}if(!c){delete j[k].data;if(!m(j[k]))return}f.support.deleteExpando||!j.setInterval?delete j[k]:j[k]=null,i&&(f.support.deleteExpando?delete a[h]:a.removeAttribute?a.removeAttribute(h):a[h]=null)}},_data:function(a,b,c){return f.data(a,b,c,!0)},acceptData:function(a){if(a.nodeName){var b=f.noData[a.nodeName.toLowerCase()];if(b)return b!==!0&&a.getAttribute("classid")===b}return!0}}),f.fn.extend({data:function(a,c){var d,e,g,h=null;if(typeof a=="undefined"){if(this.length){h=f.data(this[0]);if(this[0].nodeType===1&&!f._data(this[0],"parsedAttrs")){e=this[0].attributes;for(var i=0,j=e.length;i<j;i++)g=e[i].name,g.indexOf("data-")===0&&(g=f.camelCase(g.substring(5)),l(this[0],g,h[g]));f._data(this[0],"parsedAttrs",!0)}}return h}if(typeof a=="object")return this.each(function(){f.data(this,a)});d=a.split("."),d[1]=d[1]?"."+d[1]:"";if(c===b){h=this.triggerHandler("getData"+d[1]+"!",[d[0]]),h===b&&this.length&&(h=f.data(this[0],a),h=l(this[0],a,h));return h===b&&d[1]?this.data(d[0]):h}return this.each(function(){var b=f(this),e=[d[0],c];b.triggerHandler("setData"+d[1]+"!",e),f.data(this,a,c),b.triggerHandler("changeData"+d[1]+"!",e)})},removeData:function(a){return this.each(function(){f.removeData(this,a)})}}),f.extend({_mark:function(a,b){a&&(b=(b||"fx")+"mark",f._data(a,b,(f._data(a,b)||0)+1))},_unmark:function(a,b,c){a!==!0&&(c=b,b=a,a=!1);if(b){c=c||"fx";var d=c+"mark",e=a?0:(f._data(b,d)||1)-1;e?f._data(b,d,e):(f.removeData(b,d,!0),n(b,c,"mark"))}},queue:function(a,b,c){var d;if(a){b=(b||"fx")+"queue",d=f._data(a,b),c&&(!d||f.isArray(c)?d=f._data(a,b,f.makeArray(c)):d.push(c));return d||[]}},dequeue:function(a,b){b=b||"fx";var c=f.queue(a,b),d=c.shift(),e={};d==="inprogress"&&(d=c.shift()),d&&(b==="fx"&&c.unshift("inprogress"),f._data(a,b+".run",e),d.call(a,function(){f.dequeue(a,b)},e)),c.length||(f.removeData(a,b+"queue "+b+".run",!0),n(a,b,"queue"))}}),f.fn.extend({queue:function(a,c){typeof a!="string"&&(c=a,a="fx");if(c===b)return f.queue(this[0],a);return this.each(function(){var b=f.queue(this,a,c);a==="fx"&&b[0]!=="inprogress"&&f.dequeue(this,a)})},dequeue:function(a){return this.each(function(){f.dequeue(this,a)})},delay:function(a,b){a=f.fx?f.fx.speeds[a]||a:a,b=b||"fx";return this.queue(b,function(b,c){var d=setTimeout(b,a);c.stop=function(){clearTimeout(d)}})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,c){function m(){--h||d.resolveWith(e,[e])}typeof a!="string"&&(c=a,a=b),a=a||"fx";var d=f.Deferred(),e=this,g=e.length,h=1,i=a+"defer",j=a+"queue",k=a+"mark",l;while(g--)if(l=f.data(e[g],i,b,!0)||(f.data(e[g],j,b,!0)||f.data(e[g],k,b,!0))&&f.data(e[g],i,f.Callbacks("once memory"),!0))h++,l.add(m);m();return d.promise()}});var o=/[\n\t\r]/g,p=/\s+/,q=/\r/g,r=/^(?:button|input)$/i,s=/^(?:button|input|object|select|textarea)$/i,t=/^a(?:rea)?$/i,u=/^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,v=f.support.getSetAttribute,w,x,y;f.fn.extend({attr:function(a,b){return f.access(this,a,b,!0,f.attr)},removeAttr:function(a){return this.each(function(){f.removeAttr(this,a)})},prop:function(a,b){return f.access(this,a,b,!0,f.prop)},removeProp:function(a){a=f.propFix[a]||a;return this.each(function(){try{this[a]=b,delete this[a]}catch(c){}})},addClass:function(a){var b,c,d,e,g,h,i;if(f.isFunction(a))return this.each(function(b){f(this).addClass(a.call(this,b,this.className))});if(a&&typeof a=="string"){b=a.split(p);for(c=0,d=this.length;c<d;c++){e=this[c];if(e.nodeType===1)if(!e.className&&b.length===1)e.className=a;else{g=" "+e.className+" ";for(h=0,i=b.length;h<i;h++)~g.indexOf(" "+b[h]+" ")||(g+=b[h]+" ");e.className=f.trim(g)}}}return this},removeClass:function(a){var c,d,e,g,h,i,j;if(f.isFunction(a))return this.each(function(b){f(this).removeClass(a.call(this,b,this.className))});if(a&&typeof a=="string"||a===b){c=(a||"").split(p);for(d=0,e=this.length;d<e;d++){g=this[d];if(g.nodeType===1&&g.className)if(a){h=(" "+g.className+" ").replace(o," ");for(i=0,j=c.length;i<j;i++)h=h.replace(" "+c[i]+" "," ");g.className=f.trim(h)}else g.className=""}}return this},toggleClass:function(a,b){var c=typeof a,d=typeof b=="boolean";if(f.isFunction(a))return this.each(function(c){f(this).toggleClass(a.call(this,c,this.className,b),b)});return this.each(function(){if(c==="string"){var e,g=0,h=f(this),i=b,j=a.split(p);while(e=j[g++])i=d?i:!h.hasClass(e),h[i?"addClass":"removeClass"](e)}else if(c==="undefined"||c==="boolean")this.className&&f._data(this,"__className__",this.className),this.className=this.className||a===!1?"":f._data(this,"__className__")||""})},hasClass:function(a){var b=" "+a+" ",c=0,d=this.length;for(;c<d;c++)if(this[c].nodeType===1&&(" "+this[c].className+" ").replace(o," ").indexOf(b)>-1)return!0;return!1},val:function(a){var c,d,e,g=this[0];{if(!!arguments.length){e=f.isFunction(a);return this.each(function(d){var g=f(this),h;if(this.nodeType===1){e?h=a.call(this,d,g.val()):h=a,h==null?h="":typeof h=="number"?h+="":f.isArray(h)&&(h=f.map(h,function(a){return a==null?"":a+""})),c=f.valHooks[this.nodeName.toLowerCase()]||f.valHooks[this.type];if(!c||!("set"in c)||c.set(this,h,"value")===b)this.value=h}})}if(g){c=f.valHooks[g.nodeName.toLowerCase()]||f.valHooks[g.type];if(c&&"get"in c&&(d=c.get(g,"value"))!==b)return d;d=g.value;return typeof d=="string"?d.replace(q,""):d==null?"":d}}}}),f.extend({valHooks:{option:{get:function(a){var b=a.attributes.value;return!b||b.specified?a.value:a.text}},select:{get:function(a){var b,c,d,e,g=a.selectedIndex,h=[],i=a.options,j=a.type==="select-one";if(g<0)return null;c=j?g:0,d=j?g+1:i.length;for(;c<d;c++){e=i[c];if(e.selected&&(f.support.optDisabled?!e.disabled:e.getAttribute("disabled")===null)&&(!e.parentNode.disabled||!f.nodeName(e.parentNode,"optgroup"))){b=f(e).val();if(j)return b;h.push(b)}}if(j&&!h.length&&i.length)return f(i[g]).val();return h},set:function(a,b){var c=f.makeArray(b);f(a).find("option").each(function(){this.selected=f.inArray(f(this).val(),c)>=0}),c.length||(a.selectedIndex=-1);return c}}},attrFn:{val:!0,css:!0,html:!0,text:!0,data:!0,width:!0,height:!0,offset:!0},attr:function(a,c,d,e){var g,h,i,j=a.nodeType;if(!!a&&j!==3&&j!==8&&j!==2){if(e&&c in f.attrFn)return f(a)[c](d);if(typeof a.getAttribute=="undefined")return f.prop(a,c,d);i=j!==1||!f.isXMLDoc(a),i&&(c=c.toLowerCase(),h=f.attrHooks[c]||(u.test(c)?x:w));if(d!==b){if(d===null){f.removeAttr(a,c);return}if(h&&"set"in h&&i&&(g=h.set(a,d,c))!==b)return g;a.setAttribute(c,""+d);return d}if(h&&"get"in h&&i&&(g=h.get(a,c))!==null)return g;g=a.getAttribute(c);return g===null?b:g}},removeAttr:function(a,b){var c,d,e,g,h=0;if(b&&a.nodeType===1){d=b.toLowerCase().split(p),g=d.length;for(;h<g;h++)e=d[h],e&&(c=f.propFix[e]||e,f.attr(a,e,""),a.removeAttribute(v?e:c),u.test(e)&&c in a&&(a[c]=!1))}},attrHooks:{type:{set:function(a,b){if(r.test(a.nodeName)&&a.parentNode)f.error("type property can't be changed");else if(!f.support.radioValue&&b==="radio"&&f.nodeName(a,"input")){var c=a.value;a.setAttribute("type",b),c&&(a.value=c);return b}}},value:{get:function(a,b){if(w&&f.nodeName(a,"button"))return w.get(a,b);return b in a?a.value:null},set:function(a,b,c){if(w&&f.nodeName(a,"button"))return w.set(a,b,c);a.value=b}}},propFix:{tabindex:"tabIndex",readonly:"readOnly","for":"htmlFor","class":"className",maxlength:"maxLength",cellspacing:"cellSpacing",cellpadding:"cellPadding",rowspan:"rowSpan",colspan:"colSpan",usemap:"useMap",frameborder:"frameBorder",contenteditable:"contentEditable"},prop:function(a,c,d){var e,g,h,i=a.nodeType;if(!!a&&i!==3&&i!==8&&i!==2){h=i!==1||!f.isXMLDoc(a),h&&(c=f.propFix[c]||c,g=f.propHooks[c]);return d!==b?g&&"set"in g&&(e=g.set(a,d,c))!==b?e:a[c]=d:g&&"get"in g&&(e=g.get(a,c))!==null?e:a[c]}},propHooks:{tabIndex:{get:function(a){var c=a.getAttributeNode("tabindex");return c&&c.specified?parseInt(c.value,10):s.test(a.nodeName)||t.test(a.nodeName)&&a.href?0:b}}}}),f.attrHooks.tabindex=f.propHooks.tabIndex,x={get:function(a,c){var d,e=f.prop(a,c);return e===!0||typeof e!="boolean"&&(d=a.getAttributeNode(c))&&d.nodeValue!==!1?c.toLowerCase():b},set:function(a,b,c){var d;b===!1?f.removeAttr(a,c):(d=f.propFix[c]||c,d in a&&(a[d]=!0),a.setAttribute(c,c.toLowerCase()));return c}},v||(y={name:!0,id:!0},w=f.valHooks.button={get:function(a,c){var d;d=a.getAttributeNode(c);return d&&(y[c]?d.nodeValue!=="":d.specified)?d.nodeValue:b},set:function(a,b,d){var e=a.getAttributeNode(d);e||(e=c.createAttribute(d),a.setAttributeNode(e));return e.nodeValue=b+""}},f.attrHooks.tabindex.set=w.set,f.each(["width","height"],function(a,b){f.attrHooks[b]=f.extend(f.attrHooks[b],{set:function(a,c){if(c===""){a.setAttribute(b,"auto");return c}}})}),f.attrHooks.contenteditable={get:w.get,set:function(a,b,c){b===""&&(b="false"),w.set(a,b,c)}}),f.support.hrefNormalized||f.each(["href","src","width","height"],function(a,c){f.attrHooks[c]=f.extend(f.attrHooks[c],{get:function(a){var d=a.getAttribute(c,2);return d===null?b:d}})}),f.support.style||(f.attrHooks.style={get:function(a){return a.style.cssText.toLowerCase()||b},set:function(a,b){return a.style.cssText=""+b}}),f.support.optSelected||(f.propHooks.selected=f.extend(f.propHooks.selected,{get:function(a){var b=a.parentNode;b&&(b.selectedIndex,b.parentNode&&b.parentNode.selectedIndex);return null}})),f.support.enctype||(f.propFix.enctype="encoding"),f.support.checkOn||f.each(["radio","checkbox"],function(){f.valHooks[this]={get:function(a){return a.getAttribute("value")===null?"on":a.value}}}),f.each(["radio","checkbox"],function(){f.valHooks[this]=f.extend(f.valHooks[this],{set:function(a,b){if(f.isArray(b))return a.checked=f.inArray(f(a).val(),b)>=0}})});var z=/^(?:textarea|input|select)$/i,A=/^([^\.]*)?(?:\.(.+))?$/,B=/\bhover(\.\S+)?\b/,C=/^key/,D=/^(?:mouse|contextmenu)|click/,E=/^(?:focusinfocus|focusoutblur)$/,F=/^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,G=function(a){var b=F.exec(a);b&&(b[1]=(b[1]||"").toLowerCase(),b[3]=b[3]&&new RegExp("(?:^|\\s)"+b[3]+"(?:\\s|$)"));return b},H=function(a,b){var c=a.attributes||{};return(!b[1]||a.nodeName.toLowerCase()===b[1])&&(!b[2]||(c.id||{}).value===b[2])&&(!b[3]||b[3].test((c["class"]||{}).value))},I=function(a){return f.event.special.hover?a:a.replace(B,"mouseenter$1 mouseleave$1")};
f.event={add:function(a,c,d,e,g){var h,i,j,k,l,m,n,o,p,q,r,s;if(!(a.nodeType===3||a.nodeType===8||!c||!d||!(h=f._data(a)))){d.handler&&(p=d,d=p.handler),d.guid||(d.guid=f.guid++),j=h.events,j||(h.events=j={}),i=h.handle,i||(h.handle=i=function(a){return typeof f!="undefined"&&(!a||f.event.triggered!==a.type)?f.event.dispatch.apply(i.elem,arguments):b},i.elem=a),c=f.trim(I(c)).split(" ");for(k=0;k<c.length;k++){l=A.exec(c[k])||[],m=l[1],n=(l[2]||"").split(".").sort(),s=f.event.special[m]||{},m=(g?s.delegateType:s.bindType)||m,s=f.event.special[m]||{},o=f.extend({type:m,origType:l[1],data:e,handler:d,guid:d.guid,selector:g,quick:G(g),namespace:n.join(".")},p),r=j[m];if(!r){r=j[m]=[],r.delegateCount=0;if(!s.setup||s.setup.call(a,e,n,i)===!1)a.addEventListener?a.addEventListener(m,i,!1):a.attachEvent&&a.attachEvent("on"+m,i)}s.add&&(s.add.call(a,o),o.handler.guid||(o.handler.guid=d.guid)),g?r.splice(r.delegateCount++,0,o):r.push(o),f.event.global[m]=!0}a=null}},global:{},remove:function(a,b,c,d,e){var g=f.hasData(a)&&f._data(a),h,i,j,k,l,m,n,o,p,q,r,s;if(!!g&&!!(o=g.events)){b=f.trim(I(b||"")).split(" ");for(h=0;h<b.length;h++){i=A.exec(b[h])||[],j=k=i[1],l=i[2];if(!j){for(j in o)f.event.remove(a,j+b[h],c,d,!0);continue}p=f.event.special[j]||{},j=(d?p.delegateType:p.bindType)||j,r=o[j]||[],m=r.length,l=l?new RegExp("(^|\\.)"+l.split(".").sort().join("\\.(?:.*\\.)?")+"(\\.|$)"):null;for(n=0;n<r.length;n++)s=r[n],(e||k===s.origType)&&(!c||c.guid===s.guid)&&(!l||l.test(s.namespace))&&(!d||d===s.selector||d==="**"&&s.selector)&&(r.splice(n--,1),s.selector&&r.delegateCount--,p.remove&&p.remove.call(a,s));r.length===0&&m!==r.length&&((!p.teardown||p.teardown.call(a,l)===!1)&&f.removeEvent(a,j,g.handle),delete o[j])}f.isEmptyObject(o)&&(q=g.handle,q&&(q.elem=null),f.removeData(a,["events","handle"],!0))}},customEvent:{getData:!0,setData:!0,changeData:!0},trigger:function(c,d,e,g){if(!e||e.nodeType!==3&&e.nodeType!==8){var h=c.type||c,i=[],j,k,l,m,n,o,p,q,r,s;if(E.test(h+f.event.triggered))return;h.indexOf("!")>=0&&(h=h.slice(0,-1),k=!0),h.indexOf(".")>=0&&(i=h.split("."),h=i.shift(),i.sort());if((!e||f.event.customEvent[h])&&!f.event.global[h])return;c=typeof c=="object"?c[f.expando]?c:new f.Event(h,c):new f.Event(h),c.type=h,c.isTrigger=!0,c.exclusive=k,c.namespace=i.join("."),c.namespace_re=c.namespace?new RegExp("(^|\\.)"+i.join("\\.(?:.*\\.)?")+"(\\.|$)"):null,o=h.indexOf(":")<0?"on"+h:"";if(!e){j=f.cache;for(l in j)j[l].events&&j[l].events[h]&&f.event.trigger(c,d,j[l].handle.elem,!0);return}c.result=b,c.target||(c.target=e),d=d!=null?f.makeArray(d):[],d.unshift(c),p=f.event.special[h]||{};if(p.trigger&&p.trigger.apply(e,d)===!1)return;r=[[e,p.bindType||h]];if(!g&&!p.noBubble&&!f.isWindow(e)){s=p.delegateType||h,m=E.test(s+h)?e:e.parentNode,n=null;for(;m;m=m.parentNode)r.push([m,s]),n=m;n&&n===e.ownerDocument&&r.push([n.defaultView||n.parentWindow||a,s])}for(l=0;l<r.length&&!c.isPropagationStopped();l++)m=r[l][0],c.type=r[l][1],q=(f._data(m,"events")||{})[c.type]&&f._data(m,"handle"),q&&q.apply(m,d),q=o&&m[o],q&&f.acceptData(m)&&q.apply(m,d)===!1&&c.preventDefault();c.type=h,!g&&!c.isDefaultPrevented()&&(!p._default||p._default.apply(e.ownerDocument,d)===!1)&&(h!=="click"||!f.nodeName(e,"a"))&&f.acceptData(e)&&o&&e[h]&&(h!=="focus"&&h!=="blur"||c.target.offsetWidth!==0)&&!f.isWindow(e)&&(n=e[o],n&&(e[o]=null),f.event.triggered=h,e[h](),f.event.triggered=b,n&&(e[o]=n));return c.result}},dispatch:function(c){c=f.event.fix(c||a.event);var d=(f._data(this,"events")||{})[c.type]||[],e=d.delegateCount,g=[].slice.call(arguments,0),h=!c.exclusive&&!c.namespace,i=[],j,k,l,m,n,o,p,q,r,s,t;g[0]=c,c.delegateTarget=this;if(e&&!c.target.disabled&&(!c.button||c.type!=="click")){m=f(this),m.context=this.ownerDocument||this;for(l=c.target;l!=this;l=l.parentNode||this){o={},q=[],m[0]=l;for(j=0;j<e;j++)r=d[j],s=r.selector,o[s]===b&&(o[s]=r.quick?H(l,r.quick):m.is(s)),o[s]&&q.push(r);q.length&&i.push({elem:l,matches:q})}}d.length>e&&i.push({elem:this,matches:d.slice(e)});for(j=0;j<i.length&&!c.isPropagationStopped();j++){p=i[j],c.currentTarget=p.elem;for(k=0;k<p.matches.length&&!c.isImmediatePropagationStopped();k++){r=p.matches[k];if(h||!c.namespace&&!r.namespace||c.namespace_re&&c.namespace_re.test(r.namespace))c.data=r.data,c.handleObj=r,n=((f.event.special[r.origType]||{}).handle||r.handler).apply(p.elem,g),n!==b&&(c.result=n,n===!1&&(c.preventDefault(),c.stopPropagation()))}}return c.result},props:"attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(a,b){a.which==null&&(a.which=b.charCode!=null?b.charCode:b.keyCode);return a}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(a,d){var e,f,g,h=d.button,i=d.fromElement;a.pageX==null&&d.clientX!=null&&(e=a.target.ownerDocument||c,f=e.documentElement,g=e.body,a.pageX=d.clientX+(f&&f.scrollLeft||g&&g.scrollLeft||0)-(f&&f.clientLeft||g&&g.clientLeft||0),a.pageY=d.clientY+(f&&f.scrollTop||g&&g.scrollTop||0)-(f&&f.clientTop||g&&g.clientTop||0)),!a.relatedTarget&&i&&(a.relatedTarget=i===a.target?d.toElement:i),!a.which&&h!==b&&(a.which=h&1?1:h&2?3:h&4?2:0);return a}},fix:function(a){if(a[f.expando])return a;var d,e,g=a,h=f.event.fixHooks[a.type]||{},i=h.props?this.props.concat(h.props):this.props;a=f.Event(g);for(d=i.length;d;)e=i[--d],a[e]=g[e];a.target||(a.target=g.srcElement||c),a.target.nodeType===3&&(a.target=a.target.parentNode),a.metaKey===b&&(a.metaKey=a.ctrlKey);return h.filter?h.filter(a,g):a},special:{ready:{setup:f.bindReady},load:{noBubble:!0},focus:{delegateType:"focusin"},blur:{delegateType:"focusout"},beforeunload:{setup:function(a,b,c){f.isWindow(this)&&(this.onbeforeunload=c)},teardown:function(a,b){this.onbeforeunload===b&&(this.onbeforeunload=null)}}},simulate:function(a,b,c,d){var e=f.extend(new f.Event,c,{type:a,isSimulated:!0,originalEvent:{}});d?f.event.trigger(e,null,b):f.event.dispatch.call(b,e),e.isDefaultPrevented()&&c.preventDefault()}},f.event.handle=f.event.dispatch,f.removeEvent=c.removeEventListener?function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c,!1)}:function(a,b,c){a.detachEvent&&a.detachEvent("on"+b,c)},f.Event=function(a,b){if(!(this instanceof f.Event))return new f.Event(a,b);a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||a.returnValue===!1||a.getPreventDefault&&a.getPreventDefault()?K:J):this.type=a,b&&f.extend(this,b),this.timeStamp=a&&a.timeStamp||f.now(),this[f.expando]=!0},f.Event.prototype={preventDefault:function(){this.isDefaultPrevented=K;var a=this.originalEvent;!a||(a.preventDefault?a.preventDefault():a.returnValue=!1)},stopPropagation:function(){this.isPropagationStopped=K;var a=this.originalEvent;!a||(a.stopPropagation&&a.stopPropagation(),a.cancelBubble=!0)},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=K,this.stopPropagation()},isDefaultPrevented:J,isPropagationStopped:J,isImmediatePropagationStopped:J},f.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(a,b){f.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c=this,d=a.relatedTarget,e=a.handleObj,g=e.selector,h;if(!d||d!==c&&!f.contains(c,d))a.type=e.origType,h=e.handler.apply(this,arguments),a.type=b;return h}}}),f.support.submitBubbles||(f.event.special.submit={setup:function(){if(f.nodeName(this,"form"))return!1;f.event.add(this,"click._submit keypress._submit",function(a){var c=a.target,d=f.nodeName(c,"input")||f.nodeName(c,"button")?c.form:b;d&&!d._submit_attached&&(f.event.add(d,"submit._submit",function(a){this.parentNode&&!a.isTrigger&&f.event.simulate("submit",this.parentNode,a,!0)}),d._submit_attached=!0)})},teardown:function(){if(f.nodeName(this,"form"))return!1;f.event.remove(this,"._submit")}}),f.support.changeBubbles||(f.event.special.change={setup:function(){if(z.test(this.nodeName)){if(this.type==="checkbox"||this.type==="radio")f.event.add(this,"propertychange._change",function(a){a.originalEvent.propertyName==="checked"&&(this._just_changed=!0)}),f.event.add(this,"click._change",function(a){this._just_changed&&!a.isTrigger&&(this._just_changed=!1,f.event.simulate("change",this,a,!0))});return!1}f.event.add(this,"beforeactivate._change",function(a){var b=a.target;z.test(b.nodeName)&&!b._change_attached&&(f.event.add(b,"change._change",function(a){this.parentNode&&!a.isSimulated&&!a.isTrigger&&f.event.simulate("change",this.parentNode,a,!0)}),b._change_attached=!0)})},handle:function(a){var b=a.target;if(this!==b||a.isSimulated||a.isTrigger||b.type!=="radio"&&b.type!=="checkbox")return a.handleObj.handler.apply(this,arguments)},teardown:function(){f.event.remove(this,"._change");return z.test(this.nodeName)}}),f.support.focusinBubbles||f.each({focus:"focusin",blur:"focusout"},function(a,b){var d=0,e=function(a){f.event.simulate(b,a.target,f.event.fix(a),!0)};f.event.special[b]={setup:function(){d++===0&&c.addEventListener(a,e,!0)},teardown:function(){--d===0&&c.removeEventListener(a,e,!0)}}}),f.fn.extend({on:function(a,c,d,e,g){var h,i;if(typeof a=="object"){typeof c!="string"&&(d=c,c=b);for(i in a)this.on(i,c,d,a[i],g);return this}d==null&&e==null?(e=c,d=c=b):e==null&&(typeof c=="string"?(e=d,d=b):(e=d,d=c,c=b));if(e===!1)e=J;else if(!e)return this;g===1&&(h=e,e=function(a){f().off(a);return h.apply(this,arguments)},e.guid=h.guid||(h.guid=f.guid++));return this.each(function(){f.event.add(this,a,e,d,c)})},one:function(a,b,c,d){return this.on.call(this,a,b,c,d,1)},off:function(a,c,d){if(a&&a.preventDefault&&a.handleObj){var e=a.handleObj;f(a.delegateTarget).off(e.namespace?e.type+"."+e.namespace:e.type,e.selector,e.handler);return this}if(typeof a=="object"){for(var g in a)this.off(g,c,a[g]);return this}if(c===!1||typeof c=="function")d=c,c=b;d===!1&&(d=J);return this.each(function(){f.event.remove(this,a,d,c)})},bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},live:function(a,b,c){f(this.context).on(a,this.selector,b,c);return this},die:function(a,b){f(this.context).off(a,this.selector||"**",b);return this},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return arguments.length==1?this.off(a,"**"):this.off(b,a,c)},trigger:function(a,b){return this.each(function(){f.event.trigger(a,b,this)})},triggerHandler:function(a,b){if(this[0])return f.event.trigger(a,b,this[0],!0)},toggle:function(a){var b=arguments,c=a.guid||f.guid++,d=0,e=function(c){var e=(f._data(this,"lastToggle"+a.guid)||0)%d;f._data(this,"lastToggle"+a.guid,e+1),c.preventDefault();return b[e].apply(this,arguments)||!1};e.guid=c;while(d<b.length)b[d++].guid=c;return this.click(e)},hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)}}),f.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(a,b){f.fn[b]=function(a,c){c==null&&(c=a,a=null);return arguments.length>0?this.on(b,null,a,c):this.trigger(b)},f.attrFn&&(f.attrFn[b]=!0),C.test(b)&&(f.event.fixHooks[b]=f.event.keyHooks),D.test(b)&&(f.event.fixHooks[b]=f.event.mouseHooks)}),function(){function x(a,b,c,e,f,g){for(var h=0,i=e.length;h<i;h++){var j=e[h];if(j){var k=!1;j=j[a];while(j){if(j[d]===c){k=e[j.sizset];break}if(j.nodeType===1){g||(j[d]=c,j.sizset=h);if(typeof b!="string"){if(j===b){k=!0;break}}else if(m.filter(b,[j]).length>0){k=j;break}}j=j[a]}e[h]=k}}}function w(a,b,c,e,f,g){for(var h=0,i=e.length;h<i;h++){var j=e[h];if(j){var k=!1;j=j[a];while(j){if(j[d]===c){k=e[j.sizset];break}j.nodeType===1&&!g&&(j[d]=c,j.sizset=h);if(j.nodeName.toLowerCase()===b){k=j;break}j=j[a]}e[h]=k}}}var a=/((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,d="sizcache"+(Math.random()+"").replace(".",""),e=0,g=Object.prototype.toString,h=!1,i=!0,j=/\\/g,k=/\r\n/g,l=/\W/;[0,0].sort(function(){i=!1;return 0});var m=function(b,d,e,f){e=e||[],d=d||c;var h=d;if(d.nodeType!==1&&d.nodeType!==9)return[];if(!b||typeof b!="string")return e;var i,j,k,l,n,q,r,t,u=!0,v=m.isXML(d),w=[],x=b;do{a.exec(""),i=a.exec(x);if(i){x=i[3],w.push(i[1]);if(i[2]){l=i[3];break}}}while(i);if(w.length>1&&p.exec(b))if(w.length===2&&o.relative[w[0]])j=y(w[0]+w[1],d,f);else{j=o.relative[w[0]]?[d]:m(w.shift(),d);while(w.length)b=w.shift(),o.relative[b]&&(b+=w.shift()),j=y(b,j,f)}else{!f&&w.length>1&&d.nodeType===9&&!v&&o.match.ID.test(w[0])&&!o.match.ID.test(w[w.length-1])&&(n=m.find(w.shift(),d,v),d=n.expr?m.filter(n.expr,n.set)[0]:n.set[0]);if(d){n=f?{expr:w.pop(),set:s(f)}:m.find(w.pop(),w.length===1&&(w[0]==="~"||w[0]==="+")&&d.parentNode?d.parentNode:d,v),j=n.expr?m.filter(n.expr,n.set):n.set,w.length>0?k=s(j):u=!1;while(w.length)q=w.pop(),r=q,o.relative[q]?r=w.pop():q="",r==null&&(r=d),o.relative[q](k,r,v)}else k=w=[]}k||(k=j),k||m.error(q||b);if(g.call(k)==="[object Array]")if(!u)e.push.apply(e,k);else if(d&&d.nodeType===1)for(t=0;k[t]!=null;t++)k[t]&&(k[t]===!0||k[t].nodeType===1&&m.contains(d,k[t]))&&e.push(j[t]);else for(t=0;k[t]!=null;t++)k[t]&&k[t].nodeType===1&&e.push(j[t]);else s(k,e);l&&(m(l,h,e,f),m.uniqueSort(e));return e};m.uniqueSort=function(a){if(u){h=i,a.sort(u);if(h)for(var b=1;b<a.length;b++)a[b]===a[b-1]&&a.splice(b--,1)}return a},m.matches=function(a,b){return m(a,null,null,b)},m.matchesSelector=function(a,b){return m(b,null,null,[a]).length>0},m.find=function(a,b,c){var d,e,f,g,h,i;if(!a)return[];for(e=0,f=o.order.length;e<f;e++){h=o.order[e];if(g=o.leftMatch[h].exec(a)){i=g[1],g.splice(1,1);if(i.substr(i.length-1)!=="\\"){g[1]=(g[1]||"").replace(j,""),d=o.find[h](g,b,c);if(d!=null){a=a.replace(o.match[h],"");break}}}}d||(d=typeof b.getElementsByTagName!="undefined"?b.getElementsByTagName("*"):[]);return{set:d,expr:a}},m.filter=function(a,c,d,e){var f,g,h,i,j,k,l,n,p,q=a,r=[],s=c,t=c&&c[0]&&m.isXML(c[0]);while(a&&c.length){for(h in o.filter)if((f=o.leftMatch[h].exec(a))!=null&&f[2]){k=o.filter[h],l=f[1],g=!1,f.splice(1,1);if(l.substr(l.length-1)==="\\")continue;s===r&&(r=[]);if(o.preFilter[h]){f=o.preFilter[h](f,s,d,r,e,t);if(!f)g=i=!0;else if(f===!0)continue}if(f)for(n=0;(j=s[n])!=null;n++)j&&(i=k(j,f,n,s),p=e^i,d&&i!=null?p?g=!0:s[n]=!1:p&&(r.push(j),g=!0));if(i!==b){d||(s=r),a=a.replace(o.match[h],"");if(!g)return[];break}}if(a===q)if(g==null)m.error(a);else break;q=a}return s},m.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)};var n=m.getText=function(a){var b,c,d=a.nodeType,e="";if(d){if(d===1||d===9){if(typeof a.textContent=="string")return a.textContent;if(typeof a.innerText=="string")return a.innerText.replace(k,"");for(a=a.firstChild;a;a=a.nextSibling)e+=n(a)}else if(d===3||d===4)return a.nodeValue}else for(b=0;c=a[b];b++)c.nodeType!==8&&(e+=n(c));return e},o=m.selectors={order:["ID","NAME","TAG"],match:{ID:/#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,CLASS:/\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,NAME:/\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,ATTR:/\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,TAG:/^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,CHILD:/:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,POS:/:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,PSEUDO:/:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/},leftMatch:{},attrMap:{"class":"className","for":"htmlFor"},attrHandle:{href:function(a){return a.getAttribute("href")},type:function(a){return a.getAttribute("type")}},relative:{"+":function(a,b){var c=typeof b=="string",d=c&&!l.test(b),e=c&&!d;d&&(b=b.toLowerCase());for(var f=0,g=a.length,h;f<g;f++)if(h=a[f]){while((h=h.previousSibling)&&h.nodeType!==1);a[f]=e||h&&h.nodeName.toLowerCase()===b?h||!1:h===b}e&&m.filter(b,a,!0)},">":function(a,b){var c,d=typeof b=="string",e=0,f=a.length;if(d&&!l.test(b)){b=b.toLowerCase();for(;e<f;e++){c=a[e];if(c){var g=c.parentNode;a[e]=g.nodeName.toLowerCase()===b?g:!1}}}else{for(;e<f;e++)c=a[e],c&&(a[e]=d?c.parentNode:c.parentNode===b);d&&m.filter(b,a,!0)}},"":function(a,b,c){var d,f=e++,g=x;typeof b=="string"&&!l.test(b)&&(b=b.toLowerCase(),d=b,g=w),g("parentNode",b,f,a,d,c)},"~":function(a,b,c){var d,f=e++,g=x;typeof b=="string"&&!l.test(b)&&(b=b.toLowerCase(),d=b,g=w),g("previousSibling",b,f,a,d,c)}},find:{ID:function(a,b,c){if(typeof b.getElementById!="undefined"&&!c){var d=b.getElementById(a[1]);return d&&d.parentNode?[d]:[]}},NAME:function(a,b){if(typeof b.getElementsByName!="undefined"){var c=[],d=b.getElementsByName(a[1]);for(var e=0,f=d.length;e<f;e++)d[e].getAttribute("name")===a[1]&&c.push(d[e]);return c.length===0?null:c}},TAG:function(a,b){if(typeof b.getElementsByTagName!="undefined")return b.getElementsByTagName(a[1])}},preFilter:{CLASS:function(a,b,c,d,e,f){a=" "+a[1].replace(j,"")+" ";if(f)return a;for(var g=0,h;(h=b[g])!=null;g++)h&&(e^(h.className&&(" "+h.className+" ").replace(/[\t\n\r]/g," ").indexOf(a)>=0)?c||d.push(h):c&&(b[g]=!1));return!1},ID:function(a){return a[1].replace(j,"")},TAG:function(a,b){return a[1].replace(j,"").toLowerCase()},CHILD:function(a){if(a[1]==="nth"){a[2]||m.error(a[0]),a[2]=a[2].replace(/^\+|\s*/g,"");var b=/(-?)(\d*)(?:n([+\-]?\d*))?/.exec(a[2]==="even"&&"2n"||a[2]==="odd"&&"2n+1"||!/\D/.test(a[2])&&"0n+"+a[2]||a[2]);a[2]=b[1]+(b[2]||1)-0,a[3]=b[3]-0}else a[2]&&m.error(a[0]);a[0]=e++;return a},ATTR:function(a,b,c,d,e,f){var g=a[1]=a[1].replace(j,"");!f&&o.attrMap[g]&&(a[1]=o.attrMap[g]),a[4]=(a[4]||a[5]||"").replace(j,""),a[2]==="~="&&(a[4]=" "+a[4]+" ");return a},PSEUDO:function(b,c,d,e,f){if(b[1]==="not")if((a.exec(b[3])||"").length>1||/^\w/.test(b[3]))b[3]=m(b[3],null,null,c);else{var g=m.filter(b[3],c,d,!0^f);d||e.push.apply(e,g);return!1}else if(o.match.POS.test(b[0])||o.match.CHILD.test(b[0]))return!0;return b},POS:function(a){a.unshift(!0);return a}},filters:{enabled:function(a){return a.disabled===!1&&a.type!=="hidden"},disabled:function(a){return a.disabled===!0},checked:function(a){return a.checked===!0},selected:function(a){a.parentNode&&a.parentNode.selectedIndex;return a.selected===!0},parent:function(a){return!!a.firstChild},empty:function(a){return!a.firstChild},has:function(a,b,c){return!!m(c[3],a).length},header:function(a){return/h\d/i.test(a.nodeName)},text:function(a){var b=a.getAttribute("type"),c=a.type;return a.nodeName.toLowerCase()==="input"&&"text"===c&&(b===c||b===null)},radio:function(a){return a.nodeName.toLowerCase()==="input"&&"radio"===a.type},checkbox:function(a){return a.nodeName.toLowerCase()==="input"&&"checkbox"===a.type},file:function(a){return a.nodeName.toLowerCase()==="input"&&"file"===a.type},password:function(a){return a.nodeName.toLowerCase()==="input"&&"password"===a.type},submit:function(a){var b=a.nodeName.toLowerCase();return(b==="input"||b==="button")&&"submit"===a.type},image:function(a){return a.nodeName.toLowerCase()==="input"&&"image"===a.type},reset:function(a){var b=a.nodeName.toLowerCase();return(b==="input"||b==="button")&&"reset"===a.type},button:function(a){var b=a.nodeName.toLowerCase();return b==="input"&&"button"===a.type||b==="button"},input:function(a){return/input|select|textarea|button/i.test(a.nodeName)},focus:function(a){return a===a.ownerDocument.activeElement}},setFilters:{first:function(a,b){return b===0},last:function(a,b,c,d){return b===d.length-1},even:function(a,b){return b%2===0},odd:function(a,b){return b%2===1},lt:function(a,b,c){return b<c[3]-0},gt:function(a,b,c){return b>c[3]-0},nth:function(a,b,c){return c[3]-0===b},eq:function(a,b,c){return c[3]-0===b}},filter:{PSEUDO:function(a,b,c,d){var e=b[1],f=o.filters[e];if(f)return f(a,c,b,d);if(e==="contains")return(a.textContent||a.innerText||n([a])||"").indexOf(b[3])>=0;if(e==="not"){var g=b[3];for(var h=0,i=g.length;h<i;h++)if(g[h]===a)return!1;return!0}m.error(e)},CHILD:function(a,b){var c,e,f,g,h,i,j,k=b[1],l=a;switch(k){case"only":case"first":while(l=l.previousSibling)if(l.nodeType===1)return!1;if(k==="first")return!0;l=a;case"last":while(l=l.nextSibling)if(l.nodeType===1)return!1;return!0;case"nth":c=b[2],e=b[3];if(c===1&&e===0)return!0;f=b[0],g=a.parentNode;if(g&&(g[d]!==f||!a.nodeIndex)){i=0;for(l=g.firstChild;l;l=l.nextSibling)l.nodeType===1&&(l.nodeIndex=++i);g[d]=f}j=a.nodeIndex-e;return c===0?j===0:j%c===0&&j/c>=0}},ID:function(a,b){return a.nodeType===1&&a.getAttribute("id")===b},TAG:function(a,b){return b==="*"&&a.nodeType===1||!!a.nodeName&&a.nodeName.toLowerCase()===b},CLASS:function(a,b){return(" "+(a.className||a.getAttribute("class"))+" ").indexOf(b)>-1},ATTR:function(a,b){var c=b[1],d=m.attr?m.attr(a,c):o.attrHandle[c]?o.attrHandle[c](a):a[c]!=null?a[c]:a.getAttribute(c),e=d+"",f=b[2],g=b[4];return d==null?f==="!=":!f&&m.attr?d!=null:f==="="?e===g:f==="*="?e.indexOf(g)>=0:f==="~="?(" "+e+" ").indexOf(g)>=0:g?f==="!="?e!==g:f==="^="?e.indexOf(g)===0:f==="$="?e.substr(e.length-g.length)===g:f==="|="?e===g||e.substr(0,g.length+1)===g+"-":!1:e&&d!==!1},POS:function(a,b,c,d){var e=b[2],f=o.setFilters[e];if(f)return f(a,c,b,d)}}},p=o.match.POS,q=function(a,b){return"\\"+(b-0+1)};for(var r in o.match)o.match[r]=new RegExp(o.match[r].source+/(?![^\[]*\])(?![^\(]*\))/.source),o.leftMatch[r]=new RegExp(/(^(?:.|\r|\n)*?)/.source+o.match[r].source.replace(/\\(\d+)/g,q));var s=function(a,b){a=Array.prototype.slice.call(a,0);if(b){b.push.apply(b,a);return b}return a};try{Array.prototype.slice.call(c.documentElement.childNodes,0)[0].nodeType}catch(t){s=function(a,b){var c=0,d=b||[];if(g.call(a)==="[object Array]")Array.prototype.push.apply(d,a);else if(typeof a.length=="number")for(var e=a.length;c<e;c++)d.push(a[c]);else for(;a[c];c++)d.push(a[c]);return d}}var u,v;c.documentElement.compareDocumentPosition?u=function(a,b){if(a===b){h=!0;return 0}if(!a.compareDocumentPosition||!b.compareDocumentPosition)return a.compareDocumentPosition?-1:1;return a.compareDocumentPosition(b)&4?-1:1}:(u=function(a,b){if(a===b){h=!0;return 0}if(a.sourceIndex&&b.sourceIndex)return a.sourceIndex-b.sourceIndex;var c,d,e=[],f=[],g=a.parentNode,i=b.parentNode,j=g;if(g===i)return v(a,b);if(!g)return-1;if(!i)return 1;while(j)e.unshift(j),j=j.parentNode;j=i;while(j)f.unshift(j),j=j.parentNode;c=e.length,d=f.length;for(var k=0;k<c&&k<d;k++)if(e[k]!==f[k])return v(e[k],f[k]);return k===c?v(a,f[k],-1):v(e[k],b,1)},v=function(a,b,c){if(a===b)return c;var d=a.nextSibling;while(d){if(d===b)return-1;d=d.nextSibling}return 1}),function(){var a=c.createElement("div"),d="script"+(new Date).getTime(),e=c.documentElement;a.innerHTML="<a name='"+d+"'/>",e.insertBefore(a,e.firstChild),c.getElementById(d)&&(o.find.ID=function(a,c,d){if(typeof c.getElementById!="undefined"&&!d){var e=c.getElementById(a[1]);return e?e.id===a[1]||typeof e.getAttributeNode!="undefined"&&e.getAttributeNode("id").nodeValue===a[1]?[e]:b:[]}},o.filter.ID=function(a,b){var c=typeof a.getAttributeNode!="undefined"&&a.getAttributeNode("id");return a.nodeType===1&&c&&c.nodeValue===b}),e.removeChild(a),e=a=null}(),function(){var a=c.createElement("div");a.appendChild(c.createComment("")),a.getElementsByTagName("*").length>0&&(o.find.TAG=function(a,b){var c=b.getElementsByTagName(a[1]);if(a[1]==="*"){var d=[];for(var e=0;c[e];e++)c[e].nodeType===1&&d.push(c[e]);c=d}return c}),a.innerHTML="<a href='#'></a>",a.firstChild&&typeof a.firstChild.getAttribute!="undefined"&&a.firstChild.getAttribute("href")!=="#"&&(o.attrHandle.href=function(a){return a.getAttribute("href",2)}),a=null}(),c.querySelectorAll&&function(){var a=m,b=c.createElement("div"),d="__sizzle__";b.innerHTML="<p class='TEST'></p>";if(!b.querySelectorAll||b.querySelectorAll(".TEST").length!==0){m=function(b,e,f,g){e=e||c;if(!g&&!m.isXML(e)){var h=/^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(b);if(h&&(e.nodeType===1||e.nodeType===9)){if(h[1])return s(e.getElementsByTagName(b),f);if(h[2]&&o.find.CLASS&&e.getElementsByClassName)return s(e.getElementsByClassName(h[2]),f)}if(e.nodeType===9){if(b==="body"&&e.body)return s([e.body],f);if(h&&h[3]){var i=e.getElementById(h[3]);if(!i||!i.parentNode)return s([],f);if(i.id===h[3])return s([i],f)}try{return s(e.querySelectorAll(b),f)}catch(j){}}else if(e.nodeType===1&&e.nodeName.toLowerCase()!=="object"){var k=e,l=e.getAttribute("id"),n=l||d,p=e.parentNode,q=/^\s*[+~]/.test(b);l?n=n.replace(/'/g,"\\$&"):e.setAttribute("id",n),q&&p&&(e=e.parentNode);try{if(!q||p)return s(e.querySelectorAll("[id='"+n+"'] "+b),f)}catch(r){}finally{l||k.removeAttribute("id")}}}return a(b,e,f,g)};for(var e in a)m[e]=a[e];b=null}}(),function(){var a=c.documentElement,b=a.matchesSelector||a.mozMatchesSelector||a.webkitMatchesSelector||a.msMatchesSelector;if(b){var d=!b.call(c.createElement("div"),"div"),e=!1;try{b.call(c.documentElement,"[test!='']:sizzle")}catch(f){e=!0}m.matchesSelector=function(a,c){c=c.replace(/\=\s*([^'"\]]*)\s*\]/g,"='$1']");if(!m.isXML(a))try{if(e||!o.match.PSEUDO.test(c)&&!/!=/.test(c)){var f=b.call(a,c);if(f||!d||a.document&&a.document.nodeType!==11)return f}}catch(g){}return m(c,null,null,[a]).length>0}}}(),function(){var a=c.createElement("div");a.innerHTML="<div class='test e'></div><div class='test'></div>";if(!!a.getElementsByClassName&&a.getElementsByClassName("e").length!==0){a.lastChild.className="e";if(a.getElementsByClassName("e").length===1)return;o.order.splice(1,0,"CLASS"),o.find.CLASS=function(a,b,c){if(typeof b.getElementsByClassName!="undefined"&&!c)return b.getElementsByClassName(a[1])},a=null}}(),c.documentElement.contains?m.contains=function(a,b){return a!==b&&(a.contains?a.contains(b):!0)}:c.documentElement.compareDocumentPosition?m.contains=function(a,b){return!!(a.compareDocumentPosition(b)&16)}:m.contains=function(){return!1},m.isXML=function(a){var b=(a?a.ownerDocument||a:0).documentElement;return b?b.nodeName!=="HTML":!1};var y=function(a,b,c){var d,e=[],f="",g=b.nodeType?[b]:b;while(d=o.match.PSEUDO.exec(a))f+=d[0],a=a.replace(o.match.PSEUDO,"");a=o.relative[a]?a+"*":a;for(var h=0,i=g.length;h<i;h++)m(a,g[h],e,c);return m.filter(f,e)};m.attr=f.attr,m.selectors.attrMap={},f.find=m,f.expr=m.selectors,f.expr[":"]=f.expr.filters,f.unique=m.uniqueSort,f.text=m.getText,f.isXMLDoc=m.isXML,f.contains=m.contains}();var L=/Until$/,M=/^(?:parents|prevUntil|prevAll)/,N=/,/,O=/^.[^:#\[\.,]*$/,P=Array.prototype.slice,Q=f.expr.match.POS,R={children:!0,contents:!0,next:!0,prev:!0};f.fn.extend({find:function(a){var b=this,c,d;if(typeof a!="string")return f(a).filter(function(){for(c=0,d=b.length;c<d;c++)if(f.contains(b[c],this))return!0});var e=this.pushStack("","find",a),g,h,i;for(c=0,d=this.length;c<d;c++){g=e.length,f.find(a,this[c],e);if(c>0)for(h=g;h<e.length;h++)for(i=0;i<g;i++)if(e[i]===e[h]){e.splice(h--,1);break}}return e},has:function(a){var b=f(a);return this.filter(function(){for(var a=0,c=b.length;a<c;a++)if(f.contains(this,b[a]))return!0})},not:function(a){return this.pushStack(T(this,a,!1),"not",a)},filter:function(a){return this.pushStack(T(this,a,!0),"filter",a)},is:function(a){return!!a&&(typeof a=="string"?Q.test(a)?f(a,this.context).index(this[0])>=0:f.filter(a,this).length>0:this.filter(a).length>0)},closest:function(a,b){var c=[],d,e,g=this[0];if(f.isArray(a)){var h=1;while(g&&g.ownerDocument&&g!==b){for(d=0;d<a.length;d++)f(g).is(a[d])&&c.push({selector:a[d],elem:g,level:h});g=g.parentNode,h++}return c}var i=Q.test(a)||typeof a!="string"?f(a,b||this.context):0;for(d=0,e=this.length;d<e;d++){g=this[d];while(g){if(i?i.index(g)>-1:f.find.matchesSelector(g,a)){c.push(g);break}g=g.parentNode;if(!g||!g.ownerDocument||g===b||g.nodeType===11)break}}c=c.length>1?f.unique(c):c;return this.pushStack(c,"closest",a)},index:function(a){if(!a)return this[0]&&this[0].parentNode?this.prevAll().length:-1;if(typeof a=="string")return f.inArray(this[0],f(a));return f.inArray(a.jquery?a[0]:a,this)},add:function(a,b){var c=typeof a=="string"?f(a,b):f.makeArray(a&&a.nodeType?[a]:a),d=f.merge(this.get(),c);return this.pushStack(S(c[0])||S(d[0])?d:f.unique(d))},andSelf:function(){return this.add(this.prevObject)}}),f.each({parent:function(a){var b=a.parentNode;return b&&b.nodeType!==11?b:null},parents:function(a){return f.dir(a,"parentNode")},parentsUntil:function(a,b,c){return f.dir(a,"parentNode",c)},next:function(a){return f.nth(a,2,"nextSibling")},prev:function(a){return f.nth(a,2,"previousSibling")},nextAll:function(a){return f.dir(a,"nextSibling")},prevAll:function(a){return f.dir(a,"previousSibling")},nextUntil:function(a,b,c){return f.dir(a,"nextSibling",c)},prevUntil:function(a,b,c){return f.dir(a,"previousSibling",c)},siblings:function(a){return f.sibling(a.parentNode.firstChild,a)},children:function(a){return f.sibling(a.firstChild)},contents:function(a){return f.nodeName(a,"iframe")?a.contentDocument||a.contentWindow.document:f.makeArray(a.childNodes)}},function(a,b){f.fn[a]=function(c,d){var e=f.map(this,b,c);L.test(a)||(d=c),d&&typeof d=="string"&&(e=f.filter(d,e)),e=this.length>1&&!R[a]?f.unique(e):e,(this.length>1||N.test(d))&&M.test(a)&&(e=e.reverse());return this.pushStack(e,a,P.call(arguments).join(","))}}),f.extend({filter:function(a,b,c){c&&(a=":not("+a+")");return b.length===1?f.find.matchesSelector(b[0],a)?[b[0]]:[]:f.find.matches(a,b)},dir:function(a,c,d){var e=[],g=a[c];while(g&&g.nodeType!==9&&(d===b||g.nodeType!==1||!f(g).is(d)))g.nodeType===1&&e.push(g),g=g[c];return e},nth:function(a,b,c,d){b=b||1;var e=0;for(;a;a=a[c])if(a.nodeType===1&&++e===b)break;return a},sibling:function(a,b){var c=[];for(;a;a=a.nextSibling)a.nodeType===1&&a!==b&&c.push(a);return c}});var V="abbr|article|aside|audio|canvas|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",W=/ jQuery\d+="(?:\d+|null)"/g,X=/^\s+/,Y=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,Z=/<([\w:]+)/,$=/<tbody/i,_=/<|&#?\w+;/,ba=/<(?:script|style)/i,bb=/<(?:script|object|embed|option|style)/i,bc=new RegExp("<(?:"+V+")","i"),bd=/checked\s*(?:[^=]|=\s*.checked.)/i,be=/\/(java|ecma)script/i,bf=/^\s*<!(?:\[CDATA\[|\-\-)/,bg={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],area:[1,"<map>","</map>"],_default:[0,"",""]},bh=U(c);bg.optgroup=bg.option,bg.tbody=bg.tfoot=bg.colgroup=bg.caption=bg.thead,bg.th=bg.td,f.support.htmlSerialize||(bg._default=[1,"div<div>","</div>"]),f.fn.extend({text:function(a){if(f.isFunction(a))return this.each(function(b){var c=f(this);c.text(a.call(this,b,c.text()))});if(typeof a!="object"&&a!==b)return this.empty().append((this[0]&&this[0].ownerDocument||c).createTextNode(a));return f.text(this)},wrapAll:function(a){if(f.isFunction(a))return this.each(function(b){f(this).wrapAll(a.call(this,b))});if(this[0]){var b=f(a,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstChild&&a.firstChild.nodeType===1)a=a.firstChild;return a}).append(this)}return this},wrapInner:function(a){if(f.isFunction(a))return this.each(function(b){f(this).wrapInner(a.call(this,b))});return this.each(function(){var b=f(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=f.isFunction(a);return this.each(function(c){f(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(){return this.parent().each(function(){f.nodeName(this,"body")||f(this).replaceWith(this.childNodes)}).end()},append:function(){return this.domManip(arguments,!0,function(a){this.nodeType===1&&this.appendChild(a)})},prepend:function(){return this.domManip(arguments,!0,function(a){this.nodeType===1&&this.insertBefore(a,this.firstChild)})},before:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this)});if(arguments.length){var a=f.clean(arguments);a.push.apply(a,this.toArray());return this.pushStack(a,"before",arguments)}},after:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this.nextSibling)});if(arguments.length){var a=this.pushStack(this,"after",arguments);a.push.apply(a,f.clean(arguments));return a}},remove:function(a,b){for(var c=0,d;(d=this[c])!=null;c++)if(!a||f.filter(a,[d]).length)!b&&d.nodeType===1&&(f.cleanData(d.getElementsByTagName("*")),f.cleanData([d])),d.parentNode&&d.parentNode.removeChild(d);return this},empty:function()
{for(var a=0,b;(b=this[a])!=null;a++){b.nodeType===1&&f.cleanData(b.getElementsByTagName("*"));while(b.firstChild)b.removeChild(b.firstChild)}return this},clone:function(a,b){a=a==null?!1:a,b=b==null?a:b;return this.map(function(){return f.clone(this,a,b)})},html:function(a){if(a===b)return this[0]&&this[0].nodeType===1?this[0].innerHTML.replace(W,""):null;if(typeof a=="string"&&!ba.test(a)&&(f.support.leadingWhitespace||!X.test(a))&&!bg[(Z.exec(a)||["",""])[1].toLowerCase()]){a=a.replace(Y,"<$1></$2>");try{for(var c=0,d=this.length;c<d;c++)this[c].nodeType===1&&(f.cleanData(this[c].getElementsByTagName("*")),this[c].innerHTML=a)}catch(e){this.empty().append(a)}}else f.isFunction(a)?this.each(function(b){var c=f(this);c.html(a.call(this,b,c.html()))}):this.empty().append(a);return this},replaceWith:function(a){if(this[0]&&this[0].parentNode){if(f.isFunction(a))return this.each(function(b){var c=f(this),d=c.html();c.replaceWith(a.call(this,b,d))});typeof a!="string"&&(a=f(a).detach());return this.each(function(){var b=this.nextSibling,c=this.parentNode;f(this).remove(),b?f(b).before(a):f(c).append(a)})}return this.length?this.pushStack(f(f.isFunction(a)?a():a),"replaceWith",a):this},detach:function(a){return this.remove(a,!0)},domManip:function(a,c,d){var e,g,h,i,j=a[0],k=[];if(!f.support.checkClone&&arguments.length===3&&typeof j=="string"&&bd.test(j))return this.each(function(){f(this).domManip(a,c,d,!0)});if(f.isFunction(j))return this.each(function(e){var g=f(this);a[0]=j.call(this,e,c?g.html():b),g.domManip(a,c,d)});if(this[0]){i=j&&j.parentNode,f.support.parentNode&&i&&i.nodeType===11&&i.childNodes.length===this.length?e={fragment:i}:e=f.buildFragment(a,this,k),h=e.fragment,h.childNodes.length===1?g=h=h.firstChild:g=h.firstChild;if(g){c=c&&f.nodeName(g,"tr");for(var l=0,m=this.length,n=m-1;l<m;l++)d.call(c?bi(this[l],g):this[l],e.cacheable||m>1&&l<n?f.clone(h,!0,!0):h)}k.length&&f.each(k,bp)}return this}}),f.buildFragment=function(a,b,d){var e,g,h,i,j=a[0];b&&b[0]&&(i=b[0].ownerDocument||b[0]),i.createDocumentFragment||(i=c),a.length===1&&typeof j=="string"&&j.length<512&&i===c&&j.charAt(0)==="<"&&!bb.test(j)&&(f.support.checkClone||!bd.test(j))&&(f.support.html5Clone||!bc.test(j))&&(g=!0,h=f.fragments[j],h&&h!==1&&(e=h)),e||(e=i.createDocumentFragment(),f.clean(a,i,e,d)),g&&(f.fragments[j]=h?e:1);return{fragment:e,cacheable:g}},f.fragments={},f.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){f.fn[a]=function(c){var d=[],e=f(c),g=this.length===1&&this[0].parentNode;if(g&&g.nodeType===11&&g.childNodes.length===1&&e.length===1){e[b](this[0]);return this}for(var h=0,i=e.length;h<i;h++){var j=(h>0?this.clone(!0):this).get();f(e[h])[b](j),d=d.concat(j)}return this.pushStack(d,a,e.selector)}}),f.extend({clone:function(a,b,c){var d,e,g,h=f.support.html5Clone||!bc.test("<"+a.nodeName)?a.cloneNode(!0):bo(a);if((!f.support.noCloneEvent||!f.support.noCloneChecked)&&(a.nodeType===1||a.nodeType===11)&&!f.isXMLDoc(a)){bk(a,h),d=bl(a),e=bl(h);for(g=0;d[g];++g)e[g]&&bk(d[g],e[g])}if(b){bj(a,h);if(c){d=bl(a),e=bl(h);for(g=0;d[g];++g)bj(d[g],e[g])}}d=e=null;return h},clean:function(a,b,d,e){var g;b=b||c,typeof b.createElement=="undefined"&&(b=b.ownerDocument||b[0]&&b[0].ownerDocument||c);var h=[],i;for(var j=0,k;(k=a[j])!=null;j++){typeof k=="number"&&(k+="");if(!k)continue;if(typeof k=="string")if(!_.test(k))k=b.createTextNode(k);else{k=k.replace(Y,"<$1></$2>");var l=(Z.exec(k)||["",""])[1].toLowerCase(),m=bg[l]||bg._default,n=m[0],o=b.createElement("div");b===c?bh.appendChild(o):U(b).appendChild(o),o.innerHTML=m[1]+k+m[2];while(n--)o=o.lastChild;if(!f.support.tbody){var p=$.test(k),q=l==="table"&&!p?o.firstChild&&o.firstChild.childNodes:m[1]==="<table>"&&!p?o.childNodes:[];for(i=q.length-1;i>=0;--i)f.nodeName(q[i],"tbody")&&!q[i].childNodes.length&&q[i].parentNode.removeChild(q[i])}!f.support.leadingWhitespace&&X.test(k)&&o.insertBefore(b.createTextNode(X.exec(k)[0]),o.firstChild),k=o.childNodes}var r;if(!f.support.appendChecked)if(k[0]&&typeof (r=k.length)=="number")for(i=0;i<r;i++)bn(k[i]);else bn(k);k.nodeType?h.push(k):h=f.merge(h,k)}if(d){g=function(a){return!a.type||be.test(a.type)};for(j=0;h[j];j++)if(e&&f.nodeName(h[j],"script")&&(!h[j].type||h[j].type.toLowerCase()==="text/javascript"))e.push(h[j].parentNode?h[j].parentNode.removeChild(h[j]):h[j]);else{if(h[j].nodeType===1){var s=f.grep(h[j].getElementsByTagName("script"),g);h.splice.apply(h,[j+1,0].concat(s))}d.appendChild(h[j])}}return h},cleanData:function(a){var b,c,d=f.cache,e=f.event.special,g=f.support.deleteExpando;for(var h=0,i;(i=a[h])!=null;h++){if(i.nodeName&&f.noData[i.nodeName.toLowerCase()])continue;c=i[f.expando];if(c){b=d[c];if(b&&b.events){for(var j in b.events)e[j]?f.event.remove(i,j):f.removeEvent(i,j,b.handle);b.handle&&(b.handle.elem=null)}g?delete i[f.expando]:i.removeAttribute&&i.removeAttribute(f.expando),delete d[c]}}}});var bq=/alpha\([^)]*\)/i,br=/opacity=([^)]*)/,bs=/([A-Z]|^ms)/g,bt=/^-?\d+(?:px)?$/i,bu=/^-?\d/,bv=/^([\-+])=([\-+.\de]+)/,bw={position:"absolute",visibility:"hidden",display:"block"},bx=["Left","Right"],by=["Top","Bottom"],bz,bA,bB;f.fn.css=function(a,c){if(arguments.length===2&&c===b)return this;return f.access(this,a,c,!0,function(a,c,d){return d!==b?f.style(a,c,d):f.css(a,c)})},f.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=bz(a,"opacity","opacity");return c===""?"1":c}return a.style.opacity}}},cssNumber:{fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":f.support.cssFloat?"cssFloat":"styleFloat"},style:function(a,c,d,e){if(!!a&&a.nodeType!==3&&a.nodeType!==8&&!!a.style){var g,h,i=f.camelCase(c),j=a.style,k=f.cssHooks[i];c=f.cssProps[i]||i;if(d===b){if(k&&"get"in k&&(g=k.get(a,!1,e))!==b)return g;return j[c]}h=typeof d,h==="string"&&(g=bv.exec(d))&&(d=+(g[1]+1)*+g[2]+parseFloat(f.css(a,c)),h="number");if(d==null||h==="number"&&isNaN(d))return;h==="number"&&!f.cssNumber[i]&&(d+="px");if(!k||!("set"in k)||(d=k.set(a,d))!==b)try{j[c]=d}catch(l){}}},css:function(a,c,d){var e,g;c=f.camelCase(c),g=f.cssHooks[c],c=f.cssProps[c]||c,c==="cssFloat"&&(c="float");if(g&&"get"in g&&(e=g.get(a,!0,d))!==b)return e;if(bz)return bz(a,c)},swap:function(a,b,c){var d={};for(var e in b)d[e]=a.style[e],a.style[e]=b[e];c.call(a);for(e in b)a.style[e]=d[e]}}),f.curCSS=f.css,f.each(["height","width"],function(a,b){f.cssHooks[b]={get:function(a,c,d){var e;if(c){if(a.offsetWidth!==0)return bC(a,b,d);f.swap(a,bw,function(){e=bC(a,b,d)});return e}},set:function(a,b){if(!bt.test(b))return b;b=parseFloat(b);if(b>=0)return b+"px"}}}),f.support.opacity||(f.cssHooks.opacity={get:function(a,b){return br.test((b&&a.currentStyle?a.currentStyle.filter:a.style.filter)||"")?parseFloat(RegExp.$1)/100+"":b?"1":""},set:function(a,b){var c=a.style,d=a.currentStyle,e=f.isNumeric(b)?"alpha(opacity="+b*100+")":"",g=d&&d.filter||c.filter||"";c.zoom=1;if(b>=1&&f.trim(g.replace(bq,""))===""){c.removeAttribute("filter");if(d&&!d.filter)return}c.filter=bq.test(g)?g.replace(bq,e):g+" "+e}}),f(function(){f.support.reliableMarginRight||(f.cssHooks.marginRight={get:function(a,b){var c;f.swap(a,{display:"inline-block"},function(){b?c=bz(a,"margin-right","marginRight"):c=a.style.marginRight});return c}})}),c.defaultView&&c.defaultView.getComputedStyle&&(bA=function(a,b){var c,d,e;b=b.replace(bs,"-$1").toLowerCase(),(d=a.ownerDocument.defaultView)&&(e=d.getComputedStyle(a,null))&&(c=e.getPropertyValue(b),c===""&&!f.contains(a.ownerDocument.documentElement,a)&&(c=f.style(a,b)));return c}),c.documentElement.currentStyle&&(bB=function(a,b){var c,d,e,f=a.currentStyle&&a.currentStyle[b],g=a.style;f===null&&g&&(e=g[b])&&(f=e),!bt.test(f)&&bu.test(f)&&(c=g.left,d=a.runtimeStyle&&a.runtimeStyle.left,d&&(a.runtimeStyle.left=a.currentStyle.left),g.left=b==="fontSize"?"1em":f||0,f=g.pixelLeft+"px",g.left=c,d&&(a.runtimeStyle.left=d));return f===""?"auto":f}),bz=bA||bB,f.expr&&f.expr.filters&&(f.expr.filters.hidden=function(a){var b=a.offsetWidth,c=a.offsetHeight;return b===0&&c===0||!f.support.reliableHiddenOffsets&&(a.style&&a.style.display||f.css(a,"display"))==="none"},f.expr.filters.visible=function(a){return!f.expr.filters.hidden(a)});var bD=/%20/g,bE=/\[\]$/,bF=/\r?\n/g,bG=/#.*$/,bH=/^(.*?):[ \t]*([^\r\n]*)\r?$/mg,bI=/^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,bJ=/^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,bK=/^(?:GET|HEAD)$/,bL=/^\/\//,bM=/\?/,bN=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,bO=/^(?:select|textarea)/i,bP=/\s+/,bQ=/([?&])_=[^&]*/,bR=/^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,bS=f.fn.load,bT={},bU={},bV,bW,bX=["*/"]+["*"];try{bV=e.href}catch(bY){bV=c.createElement("a"),bV.href="",bV=bV.href}bW=bR.exec(bV.toLowerCase())||[],f.fn.extend({load:function(a,c,d){if(typeof a!="string"&&bS)return bS.apply(this,arguments);if(!this.length)return this;var e=a.indexOf(" ");if(e>=0){var g=a.slice(e,a.length);a=a.slice(0,e)}var h="GET";c&&(f.isFunction(c)?(d=c,c=b):typeof c=="object"&&(c=f.param(c,f.ajaxSettings.traditional),h="POST"));var i=this;f.ajax({url:a,type:h,dataType:"html",data:c,complete:function(a,b,c){c=a.responseText,a.isResolved()&&(a.done(function(a){c=a}),i.html(g?f("<div>").append(c.replace(bN,"")).find(g):c)),d&&i.each(d,[c,b,a])}});return this},serialize:function(){return f.param(this.serializeArray())},serializeArray:function(){return this.map(function(){return this.elements?f.makeArray(this.elements):this}).filter(function(){return this.name&&!this.disabled&&(this.checked||bO.test(this.nodeName)||bI.test(this.type))}).map(function(a,b){var c=f(this).val();return c==null?null:f.isArray(c)?f.map(c,function(a,c){return{name:b.name,value:a.replace(bF,"\r\n")}}):{name:b.name,value:c.replace(bF,"\r\n")}}).get()}}),f.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "),function(a,b){f.fn[b]=function(a){return this.on(b,a)}}),f.each(["get","post"],function(a,c){f[c]=function(a,d,e,g){f.isFunction(d)&&(g=g||e,e=d,d=b);return f.ajax({type:c,url:a,data:d,success:e,dataType:g})}}),f.extend({getScript:function(a,c){return f.get(a,b,c,"script")},getJSON:function(a,b,c){return f.get(a,b,c,"json")},ajaxSetup:function(a,b){b?b_(a,f.ajaxSettings):(b=a,a=f.ajaxSettings),b_(a,b);return a},ajaxSettings:{url:bV,isLocal:bJ.test(bW[1]),global:!0,type:"GET",contentType:"application/x-www-form-urlencoded",processData:!0,async:!0,accepts:{xml:"application/xml, text/xml",html:"text/html",text:"text/plain",json:"application/json, text/javascript","*":bX},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText"},converters:{"* text":a.String,"text html":!0,"text json":f.parseJSON,"text xml":f.parseXML},flatOptions:{context:!0,url:!0}},ajaxPrefilter:bZ(bT),ajaxTransport:bZ(bU),ajax:function(a,c){function w(a,c,l,m){if(s!==2){s=2,q&&clearTimeout(q),p=b,n=m||"",v.readyState=a>0?4:0;var o,r,u,w=c,x=l?cb(d,v,l):b,y,z;if(a>=200&&a<300||a===304){if(d.ifModified){if(y=v.getResponseHeader("Last-Modified"))f.lastModified[k]=y;if(z=v.getResponseHeader("Etag"))f.etag[k]=z}if(a===304)w="notmodified",o=!0;else try{r=cc(d,x),w="success",o=!0}catch(A){w="parsererror",u=A}}else{u=w;if(!w||a)w="error",a<0&&(a=0)}v.status=a,v.statusText=""+(c||w),o?h.resolveWith(e,[r,w,v]):h.rejectWith(e,[v,w,u]),v.statusCode(j),j=b,t&&g.trigger("ajax"+(o?"Success":"Error"),[v,d,o?r:u]),i.fireWith(e,[v,w]),t&&(g.trigger("ajaxComplete",[v,d]),--f.active||f.event.trigger("ajaxStop"))}}typeof a=="object"&&(c=a,a=b),c=c||{};var d=f.ajaxSetup({},c),e=d.context||d,g=e!==d&&(e.nodeType||e instanceof f)?f(e):f.event,h=f.Deferred(),i=f.Callbacks("once memory"),j=d.statusCode||{},k,l={},m={},n,o,p,q,r,s=0,t,u,v={readyState:0,setRequestHeader:function(a,b){if(!s){var c=a.toLowerCase();a=m[c]=m[c]||a,l[a]=b}return this},getAllResponseHeaders:function(){return s===2?n:null},getResponseHeader:function(a){var c;if(s===2){if(!o){o={};while(c=bH.exec(n))o[c[1].toLowerCase()]=c[2]}c=o[a.toLowerCase()]}return c===b?null:c},overrideMimeType:function(a){s||(d.mimeType=a);return this},abort:function(a){a=a||"abort",p&&p.abort(a),w(0,a);return this}};h.promise(v),v.success=v.done,v.error=v.fail,v.complete=i.add,v.statusCode=function(a){if(a){var b;if(s<2)for(b in a)j[b]=[j[b],a[b]];else b=a[v.status],v.then(b,b)}return this},d.url=((a||d.url)+"").replace(bG,"").replace(bL,bW[1]+"//"),d.dataTypes=f.trim(d.dataType||"*").toLowerCase().split(bP),d.crossDomain==null&&(r=bR.exec(d.url.toLowerCase()),d.crossDomain=!(!r||r[1]==bW[1]&&r[2]==bW[2]&&(r[3]||(r[1]==="http:"?80:443))==(bW[3]||(bW[1]==="http:"?80:443)))),d.data&&d.processData&&typeof d.data!="string"&&(d.data=f.param(d.data,d.traditional)),b$(bT,d,c,v);if(s===2)return!1;t=d.global,d.type=d.type.toUpperCase(),d.hasContent=!bK.test(d.type),t&&f.active++===0&&f.event.trigger("ajaxStart");if(!d.hasContent){d.data&&(d.url+=(bM.test(d.url)?"&":"?")+d.data,delete d.data),k=d.url;if(d.cache===!1){var x=f.now(),y=d.url.replace(bQ,"$1_="+x);d.url=y+(y===d.url?(bM.test(d.url)?"&":"?")+"_="+x:"")}}(d.data&&d.hasContent&&d.contentType!==!1||c.contentType)&&v.setRequestHeader("Content-Type",d.contentType),d.ifModified&&(k=k||d.url,f.lastModified[k]&&v.setRequestHeader("If-Modified-Since",f.lastModified[k]),f.etag[k]&&v.setRequestHeader("If-None-Match",f.etag[k])),v.setRequestHeader("Accept",d.dataTypes[0]&&d.accepts[d.dataTypes[0]]?d.accepts[d.dataTypes[0]]+(d.dataTypes[0]!=="*"?", "+bX+"; q=0.01":""):d.accepts["*"]);for(u in d.headers)v.setRequestHeader(u,d.headers[u]);if(d.beforeSend&&(d.beforeSend.call(e,v,d)===!1||s===2)){v.abort();return!1}for(u in{success:1,error:1,complete:1})v[u](d[u]);p=b$(bU,d,c,v);if(!p)w(-1,"No Transport");else{v.readyState=1,t&&g.trigger("ajaxSend",[v,d]),d.async&&d.timeout>0&&(q=setTimeout(function(){v.abort("timeout")},d.timeout));try{s=1,p.send(l,w)}catch(z){if(s<2)w(-1,z);else throw z}}return v},param:function(a,c){var d=[],e=function(a,b){b=f.isFunction(b)?b():b,d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(b)};c===b&&(c=f.ajaxSettings.traditional);if(f.isArray(a)||a.jquery&&!f.isPlainObject(a))f.each(a,function(){e(this.name,this.value)});else for(var g in a)ca(g,a[g],c,e);return d.join("&").replace(bD,"+")}}),f.extend({active:0,lastModified:{},etag:{}});var cd=f.now(),ce=/(\=)\?(&|$)|\?\?/i;f.ajaxSetup({jsonp:"callback",jsonpCallback:function(){return f.expando+"_"+cd++}}),f.ajaxPrefilter("json jsonp",function(b,c,d){var e=b.contentType==="application/x-www-form-urlencoded"&&typeof b.data=="string";if(b.dataTypes[0]==="jsonp"||b.jsonp!==!1&&(ce.test(b.url)||e&&ce.test(b.data))){var g,h=b.jsonpCallback=f.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,i=a[h],j=b.url,k=b.data,l="$1"+h+"$2";b.jsonp!==!1&&(j=j.replace(ce,l),b.url===j&&(e&&(k=k.replace(ce,l)),b.data===k&&(j+=(/\?/.test(j)?"&":"?")+b.jsonp+"="+h))),b.url=j,b.data=k,a[h]=function(a){g=[a]},d.always(function(){a[h]=i,g&&f.isFunction(i)&&a[h](g[0])}),b.converters["script json"]=function(){g||f.error(h+" was not called");return g[0]},b.dataTypes[0]="json";return"script"}}),f.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/javascript|ecmascript/},converters:{"text script":function(a){f.globalEval(a);return a}}}),f.ajaxPrefilter("script",function(a){a.cache===b&&(a.cache=!1),a.crossDomain&&(a.type="GET",a.global=!1)}),f.ajaxTransport("script",function(a){if(a.crossDomain){var d,e=c.head||c.getElementsByTagName("head")[0]||c.documentElement;return{send:function(f,g){d=c.createElement("script"),d.async="async",a.scriptCharset&&(d.charset=a.scriptCharset),d.src=a.url,d.onload=d.onreadystatechange=function(a,c){if(c||!d.readyState||/loaded|complete/.test(d.readyState))d.onload=d.onreadystatechange=null,e&&d.parentNode&&e.removeChild(d),d=b,c||g(200,"success")},e.insertBefore(d,e.firstChild)},abort:function(){d&&d.onload(0,1)}}}});var cf=a.ActiveXObject?function(){for(var a in ch)ch[a](0,1)}:!1,cg=0,ch;f.ajaxSettings.xhr=a.ActiveXObject?function(){return!this.isLocal&&ci()||cj()}:ci,function(a){f.extend(f.support,{ajax:!!a,cors:!!a&&"withCredentials"in a})}(f.ajaxSettings.xhr()),f.support.ajax&&f.ajaxTransport(function(c){if(!c.crossDomain||f.support.cors){var d;return{send:function(e,g){var h=c.xhr(),i,j;c.username?h.open(c.type,c.url,c.async,c.username,c.password):h.open(c.type,c.url,c.async);if(c.xhrFields)for(j in c.xhrFields)h[j]=c.xhrFields[j];c.mimeType&&h.overrideMimeType&&h.overrideMimeType(c.mimeType),!c.crossDomain&&!e["X-Requested-With"]&&(e["X-Requested-With"]="XMLHttpRequest");try{for(j in e)h.setRequestHeader(j,e[j])}catch(k){}h.send(c.hasContent&&c.data||null),d=function(a,e){var j,k,l,m,n;try{if(d&&(e||h.readyState===4)){d=b,i&&(h.onreadystatechange=f.noop,cf&&delete ch[i]);if(e)h.readyState!==4&&h.abort();else{j=h.status,l=h.getAllResponseHeaders(),m={},n=h.responseXML,n&&n.documentElement&&(m.xml=n),m.text=h.responseText;try{k=h.statusText}catch(o){k=""}!j&&c.isLocal&&!c.crossDomain?j=m.text?200:404:j===1223&&(j=204)}}}catch(p){e||g(-1,p)}m&&g(j,k,m,l)},!c.async||h.readyState===4?d():(i=++cg,cf&&(ch||(ch={},f(a).unload(cf)),ch[i]=d),h.onreadystatechange=d)},abort:function(){d&&d(0,1)}}}});var ck={},cl,cm,cn=/^(?:toggle|show|hide)$/,co=/^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,cp,cq=[["height","marginTop","marginBottom","paddingTop","paddingBottom"],["width","marginLeft","marginRight","paddingLeft","paddingRight"],["opacity"]],cr;f.fn.extend({show:function(a,b,c){var d,e;if(a||a===0)return this.animate(cu("show",3),a,b,c);for(var g=0,h=this.length;g<h;g++)d=this[g],d.style&&(e=d.style.display,!f._data(d,"olddisplay")&&e==="none"&&(e=d.style.display=""),e===""&&f.css(d,"display")==="none"&&f._data(d,"olddisplay",cv(d.nodeName)));for(g=0;g<h;g++){d=this[g];if(d.style){e=d.style.display;if(e===""||e==="none")d.style.display=f._data(d,"olddisplay")||""}}return this},hide:function(a,b,c){if(a||a===0)return this.animate(cu("hide",3),a,b,c);var d,e,g=0,h=this.length;for(;g<h;g++)d=this[g],d.style&&(e=f.css(d,"display"),e!=="none"&&!f._data(d,"olddisplay")&&f._data(d,"olddisplay",e));for(g=0;g<h;g++)this[g].style&&(this[g].style.display="none");return this},_toggle:f.fn.toggle,toggle:function(a,b,c){var d=typeof a=="boolean";f.isFunction(a)&&f.isFunction(b)?this._toggle.apply(this,arguments):a==null||d?this.each(function(){var b=d?a:f(this).is(":hidden");f(this)[b?"show":"hide"]()}):this.animate(cu("toggle",3),a,b,c);return this},fadeTo:function(a,b,c,d){return this.filter(":hidden").css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){function g(){e.queue===!1&&f._mark(this);var b=f.extend({},e),c=this.nodeType===1,d=c&&f(this).is(":hidden"),g,h,i,j,k,l,m,n,o;b.animatedProperties={};for(i in a){g=f.camelCase(i),i!==g&&(a[g]=a[i],delete a[i]),h=a[g],f.isArray(h)?(b.animatedProperties[g]=h[1],h=a[g]=h[0]):b.animatedProperties[g]=b.specialEasing&&b.specialEasing[g]||b.easing||"swing";if(h==="hide"&&d||h==="show"&&!d)return b.complete.call(this);c&&(g==="height"||g==="width")&&(b.overflow=[this.style.overflow,this.style.overflowX,this.style.overflowY],f.css(this,"display")==="inline"&&f.css(this,"float")==="none"&&(!f.support.inlineBlockNeedsLayout||cv(this.nodeName)==="inline"?this.style.display="inline-block":this.style.zoom=1))}b.overflow!=null&&(this.style.overflow="hidden");for(i in a)j=new f.fx(this,b,i),h=a[i],cn.test(h)?(o=f._data(this,"toggle"+i)||(h==="toggle"?d?"show":"hide":0),o?(f._data(this,"toggle"+i,o==="show"?"hide":"show"),j[o]()):j[h]()):(k=co.exec(h),l=j.cur(),k?(m=parseFloat(k[2]),n=k[3]||(f.cssNumber[i]?"":"px"),n!=="px"&&(f.style(this,i,(m||1)+n),l=(m||1)/j.cur()*l,f.style(this,i,l+n)),k[1]&&(m=(k[1]==="-="?-1:1)*m+l),j.custom(l,m,n)):j.custom(l,h,""));return!0}var e=f.speed(b,c,d);if(f.isEmptyObject(a))return this.each(e.complete,[!1]);a=f.extend({},a);return e.queue===!1?this.each(g):this.queue(e.queue,g)},stop:function(a,c,d){typeof a!="string"&&(d=c,c=a,a=b),c&&a!==!1&&this.queue(a||"fx",[]);return this.each(function(){function h(a,b,c){var e=b[c];f.removeData(a,c,!0),e.stop(d)}var b,c=!1,e=f.timers,g=f._data(this);d||f._unmark(!0,this);if(a==null)for(b in g)g[b]&&g[b].stop&&b.indexOf(".run")===b.length-4&&h(this,g,b);else g[b=a+".run"]&&g[b].stop&&h(this,g,b);for(b=e.length;b--;)e[b].elem===this&&(a==null||e[b].queue===a)&&(d?e[b](!0):e[b].saveState(),c=!0,e.splice(b,1));(!d||!c)&&f.dequeue(this,a)})}}),f.each({slideDown:cu("show",1),slideUp:cu("hide",1),slideToggle:cu("toggle",1),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){f.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),f.extend({speed:function(a,b,c){var d=a&&typeof a=="object"?f.extend({},a):{complete:c||!c&&b||f.isFunction(a)&&a,duration:a,easing:c&&b||b&&!f.isFunction(b)&&b};d.duration=f.fx.off?0:typeof d.duration=="number"?d.duration:d.duration in f.fx.speeds?f.fx.speeds[d.duration]:f.fx.speeds._default;if(d.queue==null||d.queue===!0)d.queue="fx";d.old=d.complete,d.complete=function(a){f.isFunction(d.old)&&d.old.call(this),d.queue?f.dequeue(this,d.queue):a!==!1&&f._unmark(this)};return d},easing:{linear:function(a,b,c,d){return c+d*a},swing:function(a,b,c,d){return(-Math.cos(a*Math.PI)/2+.5)*d+c}},timers:[],fx:function(a,b,c){this.options=b,this.elem=a,this.prop=c,b.orig=b.orig||{}}}),f.fx.prototype={update:function(){this.options.step&&this.options.step.call(this.elem,this.now,this),(f.fx.step[this.prop]||f.fx.step._default)(this)},cur:function(){if(this.elem[this.prop]!=null&&(!this.elem.style||this.elem.style[this.prop]==null))return this.elem[this.prop];var a,b=f.css(this.elem,this.prop);return isNaN(a=parseFloat(b))?!b||b==="auto"?0:b:a},custom:function(a,c,d){function h(a){return e.step(a)}var e=this,g=f.fx;this.startTime=cr||cs(),this.end=c,this.now=this.start=a,this.pos=this.state=0,this.unit=d||this.unit||(f.cssNumber[this.prop]?"":"px"),h.queue=this.options.queue,h.elem=this.elem,h.saveState=function(){e.options.hide&&f._data(e.elem,"fxshow"+e.prop)===b&&f._data(e.elem,"fxshow"+e.prop,e.start)},h()&&f.timers.push(h)&&!cp&&(cp=setInterval(g.tick,g.interval))},show:function(){var a=f._data(this.elem,"fxshow"+this.prop);this.options.orig[this.prop]=a||f.style(this.elem,this.prop),this.options.show=!0,a!==b?this.custom(this.cur(),a):this.custom(this.prop==="width"||this.prop==="height"?1:0,this.cur()),f(this.elem).show()},hide:function(){this.options.orig[this.prop]=f._data(this.elem,"fxshow"+this.prop)||f.style(this.elem,this.prop),this.options.hide=!0,this.custom(this.cur(),0)},step:function(a){var b,c,d,e=cr||cs(),g=!0,h=this.elem,i=this.options;if(a||e>=i.duration+this.startTime){this.now=this.end,this.pos=this.state=1,this.update(),i.animatedProperties[this.prop]=!0;for(b in i.animatedProperties)i.animatedProperties[b]!==!0&&(g=!1);if(g){i.overflow!=null&&!f.support.shrinkWrapBlocks&&f.each(["","X","Y"],function(a,b){h.style["overflow"+b]=i.overflow[a]}),i.hide&&f(h).hide();if(i.hide||i.show)for(b in i.animatedProperties)f.style(h,b,i.orig[b]),f.removeData(h,"fxshow"+b,!0),f.removeData(h,"toggle"+b,!0);d=i.complete,d&&(i.complete=!1,d.call(h))}return!1}i.duration==Infinity?this.now=e:(c=e-this.startTime,this.state=c/i.duration,this.pos=f.easing[i.animatedProperties[this.prop]](this.state,c,0,1,i.duration),this.now=this.start+(this.end-this.start)*this.pos),this.update();return!0}},f.extend(f.fx,{tick:function(){var a,b=f.timers,c=0;for(;c<b.length;c++)a=b[c],!a()&&b[c]===a&&b.splice(c--,1);b.length||f.fx.stop()},interval:13,stop:function(){clearInterval(cp),cp=null},speeds:{slow:600,fast:200,_default:400},step:{opacity:function(a){f.style(a.elem,"opacity",a.now)},_default:function(a){a.elem.style&&a.elem.style[a.prop]!=null?a.elem.style[a.prop]=a.now+a.unit:a.elem[a.prop]=a.now}}}),f.each(["width","height"],function(a,b){f.fx.step[b]=function(a){f.style(a.elem,b,Math.max(0,a.now)+a.unit)}}),f.expr&&f.expr.filters&&(f.expr.filters.animated=function(a){return f.grep(f.timers,function(b){return a===b.elem}).length});var cw=/^t(?:able|d|h)$/i,cx=/^(?:body|html)$/i;"getBoundingClientRect"in c.documentElement?f.fn.offset=function(a){var b=this[0],c;if(a)return this.each(function(b){f.offset.setOffset(this,a,b)});if(!b||!b.ownerDocument)return null;if(b===b.ownerDocument.body)return f.offset.bodyOffset(b);try{c=b.getBoundingClientRect()}catch(d){}var e=b.ownerDocument,g=e.documentElement;if(!c||!f.contains(g,b))return c?{top:c.top,left:c.left}:{top:0,left:0};var h=e.body,i=cy(e),j=g.clientTop||h.clientTop||0,k=g.clientLeft||h.clientLeft||0,l=i.pageYOffset||f.support.boxModel&&g.scrollTop||h.scrollTop,m=i.pageXOffset||f.support.boxModel&&g.scrollLeft||h.scrollLeft,n=c.top+l-j,o=c.left+m-k;return{top:n,left:o}}:f.fn.offset=function(a){var b=this[0];if(a)return this.each(function(b){f.offset.setOffset(this,a,b)});if(!b||!b.ownerDocument)return null;if(b===b.ownerDocument.body)return f.offset.bodyOffset(b);var c,d=b.offsetParent,e=b,g=b.ownerDocument,h=g.documentElement,i=g.body,j=g.defaultView,k=j?j.getComputedStyle(b,null):b.currentStyle,l=b.offsetTop,m=b.offsetLeft;while((b=b.parentNode)&&b!==i&&b!==h){if(f.support.fixedPosition&&k.position==="fixed")break;c=j?j.getComputedStyle(b,null):b.currentStyle,l-=b.scrollTop,m-=b.scrollLeft,b===d&&(l+=b.offsetTop,m+=b.offsetLeft,f.support.doesNotAddBorder&&(!f.support.doesAddBorderForTableAndCells||!cw.test(b.nodeName))&&(l+=parseFloat(c.borderTopWidth)||0,m+=parseFloat(c.borderLeftWidth)||0),e=d,d=b.offsetParent),f.support.subtractsBorderForOverflowNotVisible&&c.overflow!=="visible"&&(l+=parseFloat(c.borderTopWidth)||0,m+=parseFloat(c.borderLeftWidth)||0),k=c}if(k.position==="relative"||k.position==="static")l+=i.offsetTop,m+=i.offsetLeft;f.support.fixedPosition&&k.position==="fixed"&&(l+=Math.max(h.scrollTop,i.scrollTop),m+=Math.max(h.scrollLeft,i.scrollLeft));return{top:l,left:m}},f.offset={bodyOffset:function(a){var b=a.offsetTop,c=a.offsetLeft;f.support.doesNotIncludeMarginInBodyOffset&&(b+=parseFloat(f.css(a,"marginTop"))||0,c+=parseFloat(f.css(a,"marginLeft"))||0);return{top:b,left:c}},setOffset:function(a,b,c){var d=f.css(a,"position");d==="static"&&(a.style.position="relative");var e=f(a),g=e.offset(),h=f.css(a,"top"),i=f.css(a,"left"),j=(d==="absolute"||d==="fixed")&&f.inArray("auto",[h,i])>-1,k={},l={},m,n;j?(l=e.position(),m=l.top,n=l.left):(m=parseFloat(h)||0,n=parseFloat(i)||0),f.isFunction(b)&&(b=b.call(a,c,g)),b.top!=null&&(k.top=b.top-g.top+m),b.left!=null&&(k.left=b.left-g.left+n),"using"in b?b.using.call(a,k):e.css(k)}},f.fn.extend({position:function(){if(!this[0])return null;var a=this[0],b=this.offsetParent(),c=this.offset(),d=cx.test(b[0].nodeName)?{top:0,left:0}:b.offset();c.top-=parseFloat(f.css(a,"marginTop"))||0,c.left-=parseFloat(f.css(a,"marginLeft"))||0,d.top+=parseFloat(f.css(b[0],"borderTopWidth"))||0,d.left+=parseFloat(f.css(b[0],"borderLeftWidth"))||0;return{top:c.top-d.top,left:c.left-d.left}},offsetParent:function(){return this.map(function(){var a=this.offsetParent||c.body;while(a&&!cx.test(a.nodeName)&&f.css(a,"position")==="static")a=a.offsetParent;return a})}}),f.each(["Left","Top"],function(a,c){var d="scroll"+c;f.fn[d]=function(c){var e,g;if(c===b){e=this[0];if(!e)return null;g=cy(e);return g?"pageXOffset"in g?g[a?"pageYOffset":"pageXOffset"]:f.support.boxModel&&g.document.documentElement[d]||g.document.body[d]:e[d]}return this.each(function(){g=cy(this),g?g.scrollTo(a?f(g).scrollLeft():c,a?c:f(g).scrollTop()):this[d]=c})}}),f.each(["Height","Width"],function(a,c){var d=c.toLowerCase();f.fn["inner"+c]=function(){var a=this[0];return a?a.style?parseFloat(f.css(a,d,"padding")):this[d]():null},f.fn["outer"+c]=function(a){var b=this[0];return b?b.style?parseFloat(f.css(b,d,a?"margin":"border")):this[d]():null},f.fn[d]=function(a){var e=this[0];if(!e)return a==null?null:this;if(f.isFunction(a))return this.each(function(b){var c=f(this);c[d](a.call(this,b,c[d]()))});if(f.isWindow(e)){var g=e.document.documentElement["client"+c],h=e.document.body;return e.document.compatMode==="CSS1Compat"&&g||h&&h["client"+c]||g}if(e.nodeType===9)return Math.max(e.documentElement["client"+c],e.body["scroll"+c],e.documentElement["scroll"+c],e.body["offset"+c],e.documentElement["offset"+c]);if(a===b){var i=f.css(e,d),j=parseFloat(i);return f.isNumeric(j)?j:i}return this.css(d,typeof a=="string"?a:a+"px")}}),a.jQuery=a.$=f,typeof define=="function"&&define.amd&&define.amd.jQuery&&define("jquery",[],function(){return f})})(window);/* ============================================================
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Open source under the BSD License.
 *
 * Copyright © 2008 George McGinley Smith
 * All rights reserved.
 * https://raw.github.com/danro/jquery-easing/master/LICENSE
 * ======================================================== */

jQuery.easing['jswing'] = jQuery.easing['swing'];

jQuery.extend( jQuery.easing,
{
	// t: current time, b: begInnIng value, c: change In value, d: duration
	
	def: 'easeOutQuad',
	swing: function (x, t, b, c, d) {
		//alert(jQuery.easing.default);
		return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
	},
	easeInQuad: function (x, t, b, c, d) {
		return c*(t/=d)*t + b;
	},
	easeOutQuad: function (x, t, b, c, d) {
		return -c *(t/=d)*(t-2) + b;
	},
	easeInOutQuad: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInCubic: function (x, t, b, c, d) {
		return c*(t/=d)*t*t + b;
	},
	easeOutCubic: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	},
	easeInOutCubic: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	},
	easeInQuart: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t + b;
	},
	easeOutQuart: function (x, t, b, c, d) {
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeInOutQuart: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	easeInQuint: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t*t + b;
	},
	easeOutQuint: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	},
	easeInOutQuint: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
	},
	easeInSine: function (x, t, b, c, d) {
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	},
	easeOutSine: function (x, t, b, c, d) {
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	},
	easeInOutSine: function (x, t, b, c, d) {
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	},
	easeInExpo: function (x, t, b, c, d) {
		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	},
	easeOutExpo: function (x, t, b, c, d) {
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},
	easeInOutExpo: function (x, t, b, c, d) {
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	easeInCirc: function (x, t, b, c, d) {
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	},
	easeOutCirc: function (x, t, b, c, d) {
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	},
	easeInOutCirc: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	},
	easeInElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	easeOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},
	easeInOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	},
	easeInBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	easeOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},
	easeInOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158; 
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	easeInBounce: function (x, t, b, c, d) {
		return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
	},
	easeOutBounce: function (x, t, b, c, d) {
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	},
	easeInOutBounce: function (x, t, b, c, d) {
		if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
		return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
	}
});

/*
 *
 * TERMS OF USE - EASING EQUATIONS
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2001 Robert Penner
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
 */(function(e,f,g){var h,i,j;i={paneClass:"pane",sliderClass:"slider",sliderMinHeight:20,contentClass:"content",iOSNativeScrolling:!1,preventPageScrolling:!1};j=function(){var d,a;d=g.createElement("div");a=d.style;a.position="absolute";a.width="100px";a.height="100px";a.overflow="scroll";a.top="-9999px";g.body.appendChild(d);a=d.offsetWidth-d.clientWidth;g.body.removeChild(d);return a};h=function(){function d(a,b){this.options=b;this.el=e(a);this.doc=e(g);this.win=e(f);this.generate();this.createEvents();
this.addEvents();this.reset()}d.name="NanoScroll";d.prototype.preventScrolling=function(a,b){switch(a.type){case "DOMMouseScroll":("down"===b&&0<a.originalEvent.detail||"up"===b&&0>a.originalEvent.detail)&&a.preventDefault();break;case "mousewheel":("down"===b&&0>a.originalEvent.wheelDelta||"up"===b&&0<a.originalEvent.wheelDelta)&&a.preventDefault()}};d.prototype.createEvents=function(){var a=this;this.events={down:function(b){a.isDrag=!0;a.offsetY=b.clientY-a.slider.offset().top;a.pane.addClass("active");
a.doc.bind("mousemove",a.events.drag).bind("mouseup",a.events.up);return!1},drag:function(b){a.sliderY=b.clientY-a.el.offset().top-a.offsetY;a.scroll();return!1},up:function(){a.isDrag=!1;a.pane.removeClass("active");a.doc.unbind("mousemove",a.events.drag).unbind("mouseup",a.events.up);return!1},resize:function(){a.reset()},panedown:function(b){a.sliderY=b.clientY-a.el.offset().top-0.5*a.sliderH;a.scroll();a.events.down(b)},scroll:function(b){var c;!0!==a.isDrag&&(c=a.content[0],c=c.scrollTop/(c.scrollHeight-
c.clientHeight)*(a.paneH-a.sliderH),c+a.sliderH===a.paneH?(a.options.preventPageScrolling&&a.preventScrolling(b,"down"),a.el.trigger("scrollend")):0===c&&(a.options.preventPageScrolling&&a.preventScrolling(b,"up"),a.el.trigger("scrolltop")),a.slider.css({top:c+"px"}))},wheel:function(b){a.sliderY+=-b.wheelDeltaY||-b.delta;a.scroll();return!1}}};d.prototype.addEvents=function(){var a,b,c;b=this.events;c=this.pane;a=this.content;this.win.bind("resize",b.resize);this.slider.bind("mousedown",b.down);
c.bind("mousedown",b.panedown);c.bind("mousewheel",b.wheel);c.bind("DOMMouseScroll",b.wheel);a.bind("mousewheel",b.scroll);a.bind("DOMMouseScroll",b.scroll);a.bind("touchmove",b.scroll)};d.prototype.removeEvents=function(){var a,b,c;b=this.events;c=this.pane;a=this.content;this.win.unbind("resize",b.resize);this.slider.unbind("mousedown",b.down);c.unbind("mousedown",b.panedown);c.unbind("mousewheel",b.wheel);c.unbind("DOMMouseScroll",b.wheel);a.unbind("mousewheel",b.scroll);a.unbind("DOMMouseScroll",
b.scroll);a.unbind("touchmove",b.scroll)};d.prototype.generate=function(){var a;a=this.options;this.el.append('<div class="'+a.paneClass+'"><div class="'+a.sliderClass+'" /></div>');this.content=e(this.el.children("."+a.contentClass)[0]);this.slider=this.el.find("."+a.sliderClass);this.pane=this.el.find("."+a.paneClass);this.scrollW=j();a.iOSNativeScrolling?this.content.css({right:-this.scrollW+"px",WebkitOverflowScrolling:"touch"}):this.content.css({right:-this.scrollW+"px"})};d.prototype.reset=
function(){var a,b,c,d,e;this.el.find("."+this.options.paneClass).length||(this.generate(),this.stop());!0===this.isDead&&(this.isDead=!1,this.pane.show(),this.addEvents());a=this.content[0];b=a.style;c=b.overflowY;"Microsoft Internet Explorer"===f.navigator.appName&&(/msie 7./i.test(f.navigator.appVersion)&&f.ActiveXObject)&&this.content.css({height:this.content.height()});this.contentH=a.scrollHeight+this.scrollW;this.paneH=this.pane.outerHeight();e=parseInt(this.pane.css("top"),10);d=parseInt(this.pane.css("bottom"),
10);this.paneOuterH=this.paneH+e+d;this.sliderH=Math.round(this.paneOuterH/this.contentH*this.paneOuterH);this.sliderH=this.sliderH>this.options.sliderMinHeight?this.sliderH:this.options.sliderMinHeight;"scroll"===c&&"scroll"!==b.overflowX&&(this.sliderH+=this.scrollW);this.scrollH=this.paneOuterH-this.sliderH;this.slider.height(this.sliderH);this.diffH=a.scrollHeight-a.clientHeight;this.pane.show();this.paneOuterH>=a.scrollHeight&&"scroll"!==c?this.pane.hide():this.el.height()===a.scrollHeight&&
"scroll"===c?this.slider.hide():this.slider.show()};d.prototype.scroll=function(){this.sliderY=Math.max(0,this.sliderY);this.sliderY=Math.min(this.scrollH,this.sliderY);this.content.scrollTop(-((this.paneH-this.contentH+this.scrollW)*this.sliderY/this.scrollH));this.slider.css({top:this.sliderY})};d.prototype.scrollBottom=function(a){var b,c;b=this.diffH;c=this.content[0].scrollTop;this.reset();c<b&&0!==c||this.content.scrollTop(this.contentH-this.content.height()-a)};d.prototype.scrollTop=function(a){this.reset();
this.content.scrollTop(+a)};d.prototype.scrollTo=function(a){this.reset();a=e(a).offset().top;a>this.scrollH&&(a/=this.contentH,this.sliderY=a*=this.scrollH,this.scroll())};d.prototype.stop=function(){this.isDead=!0;this.removeEvents();this.pane.hide()};return d}();e.fn.nanoScroller=function(d){var a;a=e.extend({},i,d);this.each(function(){var b;b=e.data(this,"scrollbar");b||(b=new h(this,a),e.data(this,"scrollbar",b));return a.scrollBottom?b.scrollBottom(a.scrollBottom):a.scrollTop?b.scrollTop(a.scrollTop):
a.scrollTo?b.scrollTo(a.scrollTo):"bottom"===a.scroll?b.scrollBottom(0):"top"===a.scroll?b.scrollTop(0):a.scroll instanceof e?b.scrollTo(a.scroll):a.stop?b.stop():b.reset()})}})(jQuery,window,document);// Three.js - http://github.com/mrdoob/three.js
'use strict';var THREE=THREE||{REVISION:"50dev"};self.Int32Array||(self.Int32Array=Array,self.Float32Array=Array);
(function(){for(var a=0,b=["ms","moz","webkit","o"],c=0;c<b.length&&!window.requestAnimationFrame;++c){window.requestAnimationFrame=window[b[c]+"RequestAnimationFrame"];window.cancelAnimationFrame=window[b[c]+"CancelAnimationFrame"]||window[b[c]+"CancelRequestAnimationFrame"]}if(!window.requestAnimationFrame)window.requestAnimationFrame=function(b){var c=Date.now(),f=Math.max(0,16-(c-a)),g=window.setTimeout(function(){b(c+f)},f);a=c+f;return g};if(!window.cancelAnimationFrame)window.cancelAnimationFrame=
function(a){clearTimeout(a)}})();THREE.Clock=function(a){this.autoStart=a!==void 0?a:true;this.elapsedTime=this.oldTime=this.startTime=0;this.running=false};THREE.Clock.prototype.start=function(){this.oldTime=this.startTime=Date.now();this.running=true};THREE.Clock.prototype.stop=function(){this.getElapsedTime();this.running=false};THREE.Clock.prototype.getElapsedTime=function(){return this.elapsedTime=this.elapsedTime+this.getDelta()};
THREE.Clock.prototype.getDelta=function(){var a=0;this.autoStart&&!this.running&&this.start();if(this.running){var b=Date.now(),a=0.001*(b-this.oldTime);this.oldTime=b;this.elapsedTime=this.elapsedTime+a}return a};THREE.Color=function(a){a!==void 0&&this.setHex(a);return this};
THREE.Color.prototype={constructor:THREE.Color,r:1,g:1,b:1,copy:function(a){this.r=a.r;this.g=a.g;this.b=a.b;return this},copyGammaToLinear:function(a){this.r=a.r*a.r;this.g=a.g*a.g;this.b=a.b*a.b;return this},copyLinearToGamma:function(a){this.r=Math.sqrt(a.r);this.g=Math.sqrt(a.g);this.b=Math.sqrt(a.b);return this},convertGammaToLinear:function(){var a=this.r,b=this.g,c=this.b;this.r=a*a;this.g=b*b;this.b=c*c;return this},convertLinearToGamma:function(){this.r=Math.sqrt(this.r);this.g=Math.sqrt(this.g);
this.b=Math.sqrt(this.b);return this},setRGB:function(a,b,c){this.r=a;this.g=b;this.b=c;return this},setHSV:function(a,b,c){var d,e,f;if(c===0)this.r=this.g=this.b=0;else{d=Math.floor(a*6);e=a*6-d;a=c*(1-b);f=c*(1-b*e);b=c*(1-b*(1-e));switch(d){case 1:this.r=f;this.g=c;this.b=a;break;case 2:this.r=a;this.g=c;this.b=b;break;case 3:this.r=a;this.g=f;this.b=c;break;case 4:this.r=b;this.g=a;this.b=c;break;case 5:this.r=c;this.g=a;this.b=f;break;case 6:case 0:this.r=c;this.g=b;this.b=a}}return this},setHex:function(a){a=
Math.floor(a);this.r=(a>>16&255)/255;this.g=(a>>8&255)/255;this.b=(a&255)/255;return this},lerpSelf:function(a,b){this.r=this.r+(a.r-this.r)*b;this.g=this.g+(a.g-this.g)*b;this.b=this.b+(a.b-this.b)*b;return this},getHex:function(){return Math.floor(this.r*255)<<16^Math.floor(this.g*255)<<8^Math.floor(this.b*255)},getContextStyle:function(){return"rgb("+Math.floor(this.r*255)+","+Math.floor(this.g*255)+","+Math.floor(this.b*255)+")"},clone:function(){return(new THREE.Color).setRGB(this.r,this.g,this.b)}};
THREE.Vector2=function(a,b){this.x=a||0;this.y=b||0};
THREE.Vector2.prototype={constructor:THREE.Vector2,set:function(a,b){this.x=a;this.y=b;return this},copy:function(a){this.x=a.x;this.y=a.y;return this},add:function(a,b){this.x=a.x+b.x;this.y=a.y+b.y;return this},addSelf:function(a){this.x=this.x+a.x;this.y=this.y+a.y;return this},sub:function(a,b){this.x=a.x-b.x;this.y=a.y-b.y;return this},subSelf:function(a){this.x=this.x-a.x;this.y=this.y-a.y;return this},multiplyScalar:function(a){this.x=this.x*a;this.y=this.y*a;return this},divideScalar:function(a){if(a){this.x=
this.x/a;this.y=this.y/a}else this.set(0,0);return this},negate:function(){return this.multiplyScalar(-1)},dot:function(a){return this.x*a.x+this.y*a.y},lengthSq:function(){return this.x*this.x+this.y*this.y},length:function(){return Math.sqrt(this.lengthSq())},normalize:function(){return this.divideScalar(this.length())},distanceTo:function(a){return Math.sqrt(this.distanceToSquared(a))},distanceToSquared:function(a){var b=this.x-a.x,a=this.y-a.y;return b*b+a*a},setLength:function(a){return this.normalize().multiplyScalar(a)},
lerpSelf:function(a,b){this.x=this.x+(a.x-this.x)*b;this.y=this.y+(a.y-this.y)*b;return this},equals:function(a){return a.x===this.x&&a.y===this.y},isZero:function(){return this.lengthSq()<1.0E-4},clone:function(){return new THREE.Vector2(this.x,this.y)}};THREE.Vector3=function(a,b,c){this.x=a||0;this.y=b||0;this.z=c||0};
THREE.Vector3.prototype={constructor:THREE.Vector3,set:function(a,b,c){this.x=a;this.y=b;this.z=c;return this},setX:function(a){this.x=a;return this},setY:function(a){this.y=a;return this},setZ:function(a){this.z=a;return this},copy:function(a){this.x=a.x;this.y=a.y;this.z=a.z;return this},add:function(a,b){this.x=a.x+b.x;this.y=a.y+b.y;this.z=a.z+b.z;return this},addSelf:function(a){this.x=this.x+a.x;this.y=this.y+a.y;this.z=this.z+a.z;return this},addScalar:function(a){this.x=this.x+a;this.y=this.y+
a;this.z=this.z+a;return this},sub:function(a,b){this.x=a.x-b.x;this.y=a.y-b.y;this.z=a.z-b.z;return this},subSelf:function(a){this.x=this.x-a.x;this.y=this.y-a.y;this.z=this.z-a.z;return this},multiply:function(a,b){this.x=a.x*b.x;this.y=a.y*b.y;this.z=a.z*b.z;return this},multiplySelf:function(a){this.x=this.x*a.x;this.y=this.y*a.y;this.z=this.z*a.z;return this},multiplyScalar:function(a){this.x=this.x*a;this.y=this.y*a;this.z=this.z*a;return this},divideSelf:function(a){this.x=this.x/a.x;this.y=
this.y/a.y;this.z=this.z/a.z;return this},divideScalar:function(a){if(a){this.x=this.x/a;this.y=this.y/a;this.z=this.z/a}else this.z=this.y=this.x=0;return this},negate:function(){return this.multiplyScalar(-1)},dot:function(a){return this.x*a.x+this.y*a.y+this.z*a.z},lengthSq:function(){return this.x*this.x+this.y*this.y+this.z*this.z},length:function(){return Math.sqrt(this.lengthSq())},lengthManhattan:function(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)},normalize:function(){return this.divideScalar(this.length())},
setLength:function(a){return this.normalize().multiplyScalar(a)},lerpSelf:function(a,b){this.x=this.x+(a.x-this.x)*b;this.y=this.y+(a.y-this.y)*b;this.z=this.z+(a.z-this.z)*b;return this},cross:function(a,b){this.x=a.y*b.z-a.z*b.y;this.y=a.z*b.x-a.x*b.z;this.z=a.x*b.y-a.y*b.x;return this},crossSelf:function(a){var b=this.x,c=this.y,d=this.z;this.x=c*a.z-d*a.y;this.y=d*a.x-b*a.z;this.z=b*a.y-c*a.x;return this},distanceTo:function(a){return Math.sqrt(this.distanceToSquared(a))},distanceToSquared:function(a){return(new THREE.Vector3).sub(this,
a).lengthSq()},getPositionFromMatrix:function(a){this.x=a.elements[12];this.y=a.elements[13];this.z=a.elements[14];return this},getRotationFromMatrix:function(a,b){var c=b?b.x:1,d=b?b.y:1,e=b?b.z:1,f=a.elements[0]/c,g=a.elements[4]/d,c=a.elements[1]/c,d=a.elements[5]/d,h=a.elements[9]/e,j=a.elements[10]/e;this.y=Math.asin(a.elements[8]/e);e=Math.cos(this.y);if(Math.abs(e)>1.0E-5){this.x=Math.atan2(-h/e,j/e);this.z=Math.atan2(-g/e,f/e)}else{this.x=0;this.z=Math.atan2(c,d)}return this},getScaleFromMatrix:function(a){var b=
this.set(a.elements[0],a.elements[1],a.elements[2]).length(),c=this.set(a.elements[4],a.elements[5],a.elements[6]).length(),a=this.set(a.elements[8],a.elements[9],a.elements[10]).length();this.x=b;this.y=c;this.z=a},equals:function(a){return a.x===this.x&&a.y===this.y&&a.z===this.z},isZero:function(){return this.lengthSq()<1.0E-4},clone:function(){return new THREE.Vector3(this.x,this.y,this.z)}};THREE.Vector4=function(a,b,c,d){this.x=a||0;this.y=b||0;this.z=c||0;this.w=d!==void 0?d:1};
THREE.Vector4.prototype={constructor:THREE.Vector4,set:function(a,b,c,d){this.x=a;this.y=b;this.z=c;this.w=d;return this},copy:function(a){this.x=a.x;this.y=a.y;this.z=a.z;this.w=a.w!==void 0?a.w:1;return this},add:function(a,b){this.x=a.x+b.x;this.y=a.y+b.y;this.z=a.z+b.z;this.w=a.w+b.w;return this},addSelf:function(a){this.x=this.x+a.x;this.y=this.y+a.y;this.z=this.z+a.z;this.w=this.w+a.w;return this},sub:function(a,b){this.x=a.x-b.x;this.y=a.y-b.y;this.z=a.z-b.z;this.w=a.w-b.w;return this},subSelf:function(a){this.x=
this.x-a.x;this.y=this.y-a.y;this.z=this.z-a.z;this.w=this.w-a.w;return this},multiplyScalar:function(a){this.x=this.x*a;this.y=this.y*a;this.z=this.z*a;this.w=this.w*a;return this},divideScalar:function(a){if(a){this.x=this.x/a;this.y=this.y/a;this.z=this.z/a;this.w=this.w/a}else{this.z=this.y=this.x=0;this.w=1}return this},negate:function(){return this.multiplyScalar(-1)},dot:function(a){return this.x*a.x+this.y*a.y+this.z*a.z+this.w*a.w},lengthSq:function(){return this.dot(this)},length:function(){return Math.sqrt(this.lengthSq())},
normalize:function(){return this.divideScalar(this.length())},setLength:function(a){return this.normalize().multiplyScalar(a)},lerpSelf:function(a,b){this.x=this.x+(a.x-this.x)*b;this.y=this.y+(a.y-this.y)*b;this.z=this.z+(a.z-this.z)*b;this.w=this.w+(a.w-this.w)*b;return this},clone:function(){return new THREE.Vector4(this.x,this.y,this.z,this.w)}};
THREE.EventTarget=function(){var a={};this.addEventListener=function(b,c){a[b]===void 0&&(a[b]=[]);a[b].indexOf(c)===-1&&a[b].push(c)};this.dispatchEvent=function(b){for(var c in a[b.type])a[b.type][c](b)};this.removeEventListener=function(b,c){var d=a[b].indexOf(c);d!==-1&&a[b].splice(d,1)}};THREE.Frustum=function(){this.planes=[new THREE.Vector4,new THREE.Vector4,new THREE.Vector4,new THREE.Vector4,new THREE.Vector4,new THREE.Vector4]};
THREE.Frustum.prototype.setFromMatrix=function(a){var b,c=this.planes,d=a.elements,a=d[0];b=d[1];var e=d[2],f=d[3],g=d[4],h=d[5],j=d[6],k=d[7],l=d[8],o=d[9],m=d[10],p=d[11],r=d[12],n=d[13],q=d[14],d=d[15];c[0].set(f-a,k-g,p-l,d-r);c[1].set(f+a,k+g,p+l,d+r);c[2].set(f+b,k+h,p+o,d+n);c[3].set(f-b,k-h,p-o,d-n);c[4].set(f-e,k-j,p-m,d-q);c[5].set(f+e,k+j,p+m,d+q);for(a=0;a<6;a++){b=c[a];b.divideScalar(Math.sqrt(b.x*b.x+b.y*b.y+b.z*b.z))}};
THREE.Frustum.prototype.contains=function(a){for(var b=this.planes,c=a.matrixWorld,d=c.elements,c=-a.geometry.boundingSphere.radius*c.getMaxScaleOnAxis(),e=0;e<6;e++){a=b[e].x*d[12]+b[e].y*d[13]+b[e].z*d[14]+b[e].w;if(a<=c)return false}return true};THREE.Frustum.__v1=new THREE.Vector3;
THREE.Ray=function(a,b){function c(a,b,c){n.sub(c,a);t=n.dot(b);y=q.add(a,u.copy(b).multiplyScalar(t));return s=c.distanceTo(y)}function d(a,b,c,d){n.sub(d,b);q.sub(c,b);u.sub(a,b);x=n.dot(n);E=n.dot(q);D=n.dot(u);A=q.dot(q);v=q.dot(u);H=1/(x*A-E*E);I=(A*D-E*v)*H;M=(x*v-E*D)*H;return I>=0&&M>=0&&I+M<1}this.origin=a||new THREE.Vector3;this.direction=b||new THREE.Vector3;var e=1.0E-4;this.setPrecision=function(a){e=a};var f=new THREE.Vector3,g=new THREE.Vector3,h=new THREE.Vector3,j=new THREE.Vector3,
k=new THREE.Vector3,l=new THREE.Vector3,o=new THREE.Vector3,m=new THREE.Vector3,p=new THREE.Vector3,r=function(a,b){return a.distance-b.distance};this.intersectObject=function(a){var b,n=[];if(a instanceof THREE.Particle){var q=c(this.origin,this.direction,a.matrixWorld.getPosition());if(q>a.scale.x)return[];b={distance:q,point:a.position,face:null,object:a};n.push(b)}else if(a instanceof THREE.Mesh){var q=c(this.origin,this.direction,a.matrixWorld.getPosition()),s=THREE.Frustum.__v1.set(a.matrixWorld.getColumnX().length(),
a.matrixWorld.getColumnY().length(),a.matrixWorld.getColumnZ().length());if(q>a.geometry.boundingSphere.radius*Math.max(s.x,Math.max(s.y,s.z)))return n;var t,i,u=a.geometry,v=u.vertices,S;a.matrixRotationWorld.extractRotation(a.matrixWorld);q=0;for(s=u.faces.length;q<s;q++){b=u.faces[q];k.copy(this.origin);l.copy(this.direction);S=a.matrixWorld;o=S.multiplyVector3(o.copy(b.centroid)).subSelf(k);m=a.matrixRotationWorld.multiplyVector3(m.copy(b.normal));t=l.dot(m);if(!(Math.abs(t)<e)){i=m.dot(o)/t;
if(!(i<0)&&(a.doubleSided||(a.flipSided?t>0:t<0))){p.add(k,l.multiplyScalar(i));if(b instanceof THREE.Face3){f=S.multiplyVector3(f.copy(v[b.a]));g=S.multiplyVector3(g.copy(v[b.b]));h=S.multiplyVector3(h.copy(v[b.c]));if(d(p,f,g,h)){b={distance:k.distanceTo(p),point:p.clone(),face:b,object:a};n.push(b)}}else if(b instanceof THREE.Face4){f=S.multiplyVector3(f.copy(v[b.a]));g=S.multiplyVector3(g.copy(v[b.b]));h=S.multiplyVector3(h.copy(v[b.c]));j=S.multiplyVector3(j.copy(v[b.d]));if(d(p,f,g,j)||d(p,
g,h,j)){b={distance:k.distanceTo(p),point:p.clone(),face:b,object:a};n.push(b)}}}}}}n.sort(r);return n};this.intersectObjects=function(a){for(var b=[],c=0,d=a.length;c<d;c++)Array.prototype.push.apply(b,this.intersectObject(a[c]));b.sort(r);return b};var n=new THREE.Vector3,q=new THREE.Vector3,u=new THREE.Vector3,t,y,s,x,E,D,A,v,H,I,M};
THREE.Rectangle=function(){function a(){f=d-b;g=e-c}var b,c,d,e,f,g,h=true;this.getX=function(){return b};this.getY=function(){return c};this.getWidth=function(){return f};this.getHeight=function(){return g};this.getLeft=function(){return b};this.getTop=function(){return c};this.getRight=function(){return d};this.getBottom=function(){return e};this.set=function(f,g,l,o){h=false;b=f;c=g;d=l;e=o;a()};this.addPoint=function(f,g){if(h){h=false;b=f;c=g;d=f;e=g}else{b=b<f?b:f;c=c<g?c:g;d=d>f?d:f;e=e>g?
e:g}a()};this.add3Points=function(f,g,l,o,m,p){if(h){h=false;b=f<l?f<m?f:m:l<m?l:m;c=g<o?g<p?g:p:o<p?o:p;d=f>l?f>m?f:m:l>m?l:m;e=g>o?g>p?g:p:o>p?o:p}else{b=f<l?f<m?f<b?f:b:m<b?m:b:l<m?l<b?l:b:m<b?m:b;c=g<o?g<p?g<c?g:c:p<c?p:c:o<p?o<c?o:c:p<c?p:c;d=f>l?f>m?f>d?f:d:m>d?m:d:l>m?l>d?l:d:m>d?m:d;e=g>o?g>p?g>e?g:e:p>e?p:e:o>p?o>e?o:e:p>e?p:e}a()};this.addRectangle=function(f){if(h){h=false;b=f.getLeft();c=f.getTop();d=f.getRight();e=f.getBottom()}else{b=b<f.getLeft()?b:f.getLeft();c=c<f.getTop()?c:f.getTop();
d=d>f.getRight()?d:f.getRight();e=e>f.getBottom()?e:f.getBottom()}a()};this.inflate=function(f){b=b-f;c=c-f;d=d+f;e=e+f;a()};this.minSelf=function(f){b=b>f.getLeft()?b:f.getLeft();c=c>f.getTop()?c:f.getTop();d=d<f.getRight()?d:f.getRight();e=e<f.getBottom()?e:f.getBottom();a()};this.intersects=function(a){return d<a.getLeft()||b>a.getRight()||e<a.getTop()||c>a.getBottom()?false:true};this.empty=function(){h=true;e=d=c=b=0;a()};this.isEmpty=function(){return h}};
THREE.Math={clamp:function(a,b,c){return a<b?b:a>c?c:a},clampBottom:function(a,b){return a<b?b:a},mapLinear:function(a,b,c,d,e){return d+(a-b)*(e-d)/(c-b)},random16:function(){return(65280*Math.random()+255*Math.random())/65535},randInt:function(a,b){return a+Math.floor(Math.random()*(b-a+1))},randFloat:function(a,b){return a+Math.random()*(b-a)},randFloatSpread:function(a){return a*(0.5-Math.random())},sign:function(a){return a<0?-1:a>0?1:0}};THREE.Matrix3=function(){this.elements=new Float32Array(9)};
THREE.Matrix3.prototype={constructor:THREE.Matrix3,getInverse:function(a){var b=a.elements,a=b[10]*b[5]-b[6]*b[9],c=-b[10]*b[1]+b[2]*b[9],d=b[6]*b[1]-b[2]*b[5],e=-b[10]*b[4]+b[6]*b[8],f=b[10]*b[0]-b[2]*b[8],g=-b[6]*b[0]+b[2]*b[4],h=b[9]*b[4]-b[5]*b[8],j=-b[9]*b[0]+b[1]*b[8],k=b[5]*b[0]-b[1]*b[4],b=b[0]*a+b[1]*e+b[2]*h;b===0&&console.warn("Matrix3.getInverse(): determinant == 0");var b=1/b,l=this.elements;l[0]=b*a;l[1]=b*c;l[2]=b*d;l[3]=b*e;l[4]=b*f;l[5]=b*g;l[6]=b*h;l[7]=b*j;l[8]=b*k;return this},
transpose:function(){var a,b=this.elements;a=b[1];b[1]=b[3];b[3]=a;a=b[2];b[2]=b[6];b[6]=a;a=b[5];b[5]=b[7];b[7]=a;return this},transposeIntoArray:function(a){var b=this.m;a[0]=b[0];a[1]=b[3];a[2]=b[6];a[3]=b[1];a[4]=b[4];a[5]=b[7];a[6]=b[2];a[7]=b[5];a[8]=b[8];return this}};THREE.Matrix4=function(a,b,c,d,e,f,g,h,j,k,l,o,m,p,r,n){this.elements=new Float32Array(16);this.set(a!==void 0?a:1,b||0,c||0,d||0,e||0,f!==void 0?f:1,g||0,h||0,j||0,k||0,l!==void 0?l:1,o||0,m||0,p||0,r||0,n!==void 0?n:1)};
THREE.Matrix4.prototype={constructor:THREE.Matrix4,set:function(a,b,c,d,e,f,g,h,j,k,l,o,m,p,r,n){var q=this.elements;q[0]=a;q[4]=b;q[8]=c;q[12]=d;q[1]=e;q[5]=f;q[9]=g;q[13]=h;q[2]=j;q[6]=k;q[10]=l;q[14]=o;q[3]=m;q[7]=p;q[11]=r;q[15]=n;return this},identity:function(){this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1);return this},copy:function(a){a=a.elements;this.set(a[0],a[4],a[8],a[12],a[1],a[5],a[9],a[13],a[2],a[6],a[10],a[14],a[3],a[7],a[11],a[15]);return this},lookAt:function(a,b,c){var d=this.elements,
e=THREE.Matrix4.__v1,f=THREE.Matrix4.__v2,g=THREE.Matrix4.__v3;g.sub(a,b).normalize();if(g.length()===0)g.z=1;e.cross(c,g).normalize();if(e.length()===0){g.x=g.x+1.0E-4;e.cross(c,g).normalize()}f.cross(g,e);d[0]=e.x;d[4]=f.x;d[8]=g.x;d[1]=e.y;d[5]=f.y;d[9]=g.y;d[2]=e.z;d[6]=f.z;d[10]=g.z;return this},multiply:function(a,b){var c=a.elements,d=b.elements,e=this.elements,f=c[0],g=c[4],h=c[8],j=c[12],k=c[1],l=c[5],o=c[9],m=c[13],p=c[2],r=c[6],n=c[10],q=c[14],u=c[3],t=c[7],y=c[11],c=c[15],s=d[0],x=d[4],
E=d[8],D=d[12],A=d[1],v=d[5],H=d[9],I=d[13],M=d[2],R=d[6],Z=d[10],B=d[14],G=d[3],Q=d[7],C=d[11],d=d[15];e[0]=f*s+g*A+h*M+j*G;e[4]=f*x+g*v+h*R+j*Q;e[8]=f*E+g*H+h*Z+j*C;e[12]=f*D+g*I+h*B+j*d;e[1]=k*s+l*A+o*M+m*G;e[5]=k*x+l*v+o*R+m*Q;e[9]=k*E+l*H+o*Z+m*C;e[13]=k*D+l*I+o*B+m*d;e[2]=p*s+r*A+n*M+q*G;e[6]=p*x+r*v+n*R+q*Q;e[10]=p*E+r*H+n*Z+q*C;e[14]=p*D+r*I+n*B+q*d;e[3]=u*s+t*A+y*M+c*G;e[7]=u*x+t*v+y*R+c*Q;e[11]=u*E+t*H+y*Z+c*C;e[15]=u*D+t*I+y*B+c*d;return this},multiplySelf:function(a){return this.multiply(this,
a)},multiplyToArray:function(a,b,c){var d=this.elements;this.multiply(a,b);c[0]=d[0];c[1]=d[1];c[2]=d[2];c[3]=d[3];c[4]=d[4];c[5]=d[5];c[6]=d[6];c[7]=d[7];c[8]=d[8];c[9]=d[9];c[10]=d[10];c[11]=d[11];c[12]=d[12];c[13]=d[13];c[14]=d[14];c[15]=d[15];return this},multiplyScalar:function(a){var b=this.elements;b[0]=b[0]*a;b[4]=b[4]*a;b[8]=b[8]*a;b[12]=b[12]*a;b[1]=b[1]*a;b[5]=b[5]*a;b[9]=b[9]*a;b[13]=b[13]*a;b[2]=b[2]*a;b[6]=b[6]*a;b[10]=b[10]*a;b[14]=b[14]*a;b[3]=b[3]*a;b[7]=b[7]*a;b[11]=b[11]*a;b[15]=
b[15]*a;return this},multiplyVector3:function(a){var b=this.elements,c=a.x,d=a.y,e=a.z,f=1/(b[3]*c+b[7]*d+b[11]*e+b[15]);a.x=(b[0]*c+b[4]*d+b[8]*e+b[12])*f;a.y=(b[1]*c+b[5]*d+b[9]*e+b[13])*f;a.z=(b[2]*c+b[6]*d+b[10]*e+b[14])*f;return a},multiplyVector4:function(a){var b=this.elements,c=a.x,d=a.y,e=a.z,f=a.w;a.x=b[0]*c+b[4]*d+b[8]*e+b[12]*f;a.y=b[1]*c+b[5]*d+b[9]*e+b[13]*f;a.z=b[2]*c+b[6]*d+b[10]*e+b[14]*f;a.w=b[3]*c+b[7]*d+b[11]*e+b[15]*f;return a},rotateAxis:function(a){var b=this.elements,c=a.x,
d=a.y,e=a.z;a.x=c*b[0]+d*b[4]+e*b[8];a.y=c*b[1]+d*b[5]+e*b[9];a.z=c*b[2]+d*b[6]+e*b[10];a.normalize();return a},crossVector:function(a){var b=this.elements,c=new THREE.Vector4;c.x=b[0]*a.x+b[4]*a.y+b[8]*a.z+b[12]*a.w;c.y=b[1]*a.x+b[5]*a.y+b[9]*a.z+b[13]*a.w;c.z=b[2]*a.x+b[6]*a.y+b[10]*a.z+b[14]*a.w;c.w=a.w?b[3]*a.x+b[7]*a.y+b[11]*a.z+b[15]*a.w:1;return c},determinant:function(){var a=this.elements,b=a[0],c=a[4],d=a[8],e=a[12],f=a[1],g=a[5],h=a[9],j=a[13],k=a[2],l=a[6],o=a[10],m=a[14],p=a[3],r=a[7],
n=a[11],a=a[15];return e*h*l*p-d*j*l*p-e*g*o*p+c*j*o*p+d*g*m*p-c*h*m*p-e*h*k*r+d*j*k*r+e*f*o*r-b*j*o*r-d*f*m*r+b*h*m*r+e*g*k*n-c*j*k*n-e*f*l*n+b*j*l*n+c*f*m*n-b*g*m*n-d*g*k*a+c*h*k*a+d*f*l*a-b*h*l*a-c*f*o*a+b*g*o*a},transpose:function(){var a=this.elements,b;b=a[1];a[1]=a[4];a[4]=b;b=a[2];a[2]=a[8];a[8]=b;b=a[6];a[6]=a[9];a[9]=b;b=a[3];a[3]=a[12];a[12]=b;b=a[7];a[7]=a[13];a[13]=b;b=a[11];a[11]=a[14];a[14]=b;return this},flattenToArray:function(a){var b=this.elements;a[0]=b[0];a[1]=b[1];a[2]=b[2];
a[3]=b[3];a[4]=b[4];a[5]=b[5];a[6]=b[6];a[7]=b[7];a[8]=b[8];a[9]=b[9];a[10]=b[10];a[11]=b[11];a[12]=b[12];a[13]=b[13];a[14]=b[14];a[15]=b[15];return a},flattenToArrayOffset:function(a,b){var c=this.elements;a[b]=c[0];a[b+1]=c[1];a[b+2]=c[2];a[b+3]=c[3];a[b+4]=c[4];a[b+5]=c[5];a[b+6]=c[6];a[b+7]=c[7];a[b+8]=c[8];a[b+9]=c[9];a[b+10]=c[10];a[b+11]=c[11];a[b+12]=c[12];a[b+13]=c[13];a[b+14]=c[14];a[b+15]=c[15];return a},getPosition:function(){var a=this.elements;return THREE.Matrix4.__v1.set(a[12],a[13],
a[14])},setPosition:function(a){var b=this.elements;b[12]=a.x;b[13]=a.y;b[14]=a.z;return this},getColumnX:function(){var a=this.elements;return THREE.Matrix4.__v1.set(a[0],a[1],a[2])},getColumnY:function(){var a=this.elements;return THREE.Matrix4.__v1.set(a[4],a[5],a[6])},getColumnZ:function(){var a=this.elements;return THREE.Matrix4.__v1.set(a[8],a[9],a[10])},getInverse:function(a){var b=this.elements,c=a.elements,d=c[0],e=c[4],f=c[8],g=c[12],h=c[1],j=c[5],k=c[9],l=c[13],o=c[2],m=c[6],p=c[10],r=
c[14],n=c[3],q=c[7],u=c[11],c=c[15];b[0]=k*r*q-l*p*q+l*m*u-j*r*u-k*m*c+j*p*c;b[4]=g*p*q-f*r*q-g*m*u+e*r*u+f*m*c-e*p*c;b[8]=f*l*q-g*k*q+g*j*u-e*l*u-f*j*c+e*k*c;b[12]=g*k*m-f*l*m-g*j*p+e*l*p+f*j*r-e*k*r;b[1]=l*p*n-k*r*n-l*o*u+h*r*u+k*o*c-h*p*c;b[5]=f*r*n-g*p*n+g*o*u-d*r*u-f*o*c+d*p*c;b[9]=g*k*n-f*l*n-g*h*u+d*l*u+f*h*c-d*k*c;b[13]=f*l*o-g*k*o+g*h*p-d*l*p-f*h*r+d*k*r;b[2]=j*r*n-l*m*n+l*o*q-h*r*q-j*o*c+h*m*c;b[6]=g*m*n-e*r*n-g*o*q+d*r*q+e*o*c-d*m*c;b[10]=e*l*n-g*j*n+g*h*q-d*l*q-e*h*c+d*j*c;b[14]=g*j*o-
e*l*o-g*h*m+d*l*m+e*h*r-d*j*r;b[3]=k*m*n-j*p*n-k*o*q+h*p*q+j*o*u-h*m*u;b[7]=e*p*n-f*m*n+f*o*q-d*p*q-e*o*u+d*m*u;b[11]=f*j*n-e*k*n-f*h*q+d*k*q+e*h*u-d*j*u;b[15]=e*k*o-f*j*o+f*h*m-d*k*m-e*h*p+d*j*p;this.multiplyScalar(1/a.determinant());return this},setRotationFromEuler:function(a,b){var c=this.elements,d=a.x,e=a.y,f=a.z,g=Math.cos(d),d=Math.sin(d),h=Math.cos(e),e=Math.sin(e),j=Math.cos(f),f=Math.sin(f);switch(b){case "YXZ":var k=h*j,l=h*f,o=e*j,m=e*f;c[0]=k+m*d;c[4]=o*d-l;c[8]=g*e;c[1]=g*f;c[5]=g*
j;c[9]=-d;c[2]=l*d-o;c[6]=m+k*d;c[10]=g*h;break;case "ZXY":k=h*j;l=h*f;o=e*j;m=e*f;c[0]=k-m*d;c[4]=-g*f;c[8]=o+l*d;c[1]=l+o*d;c[5]=g*j;c[9]=m-k*d;c[2]=-g*e;c[6]=d;c[10]=g*h;break;case "ZYX":k=g*j;l=g*f;o=d*j;m=d*f;c[0]=h*j;c[4]=o*e-l;c[8]=k*e+m;c[1]=h*f;c[5]=m*e+k;c[9]=l*e-o;c[2]=-e;c[6]=d*h;c[10]=g*h;break;case "YZX":k=g*h;l=g*e;o=d*h;m=d*e;c[0]=h*j;c[4]=m-k*f;c[8]=o*f+l;c[1]=f;c[5]=g*j;c[9]=-d*j;c[2]=-e*j;c[6]=l*f+o;c[10]=k-m*f;break;case "XZY":k=g*h;l=g*e;o=d*h;m=d*e;c[0]=h*j;c[4]=-f;c[8]=e*j;
c[1]=k*f+m;c[5]=g*j;c[9]=l*f-o;c[2]=o*f-l;c[6]=d*j;c[10]=m*f+k;break;default:k=g*j;l=g*f;o=d*j;m=d*f;c[0]=h*j;c[4]=-h*f;c[8]=e;c[1]=l+o*e;c[5]=k-m*e;c[9]=-d*h;c[2]=m-k*e;c[6]=o+l*e;c[10]=g*h}return this},setRotationFromQuaternion:function(a){var b=this.elements,c=a.x,d=a.y,e=a.z,f=a.w,g=c+c,h=d+d,j=e+e,a=c*g,k=c*h,c=c*j,l=d*h,d=d*j,e=e*j,g=f*g,h=f*h,f=f*j;b[0]=1-(l+e);b[4]=k-f;b[8]=c+h;b[1]=k+f;b[5]=1-(a+e);b[9]=d-g;b[2]=c-h;b[6]=d+g;b[10]=1-(a+l);return this},compose:function(a,b,c){var d=this.elements,
e=THREE.Matrix4.__m1,f=THREE.Matrix4.__m2;e.identity();e.setRotationFromQuaternion(b);f.makeScale(c.x,c.y,c.z);this.multiply(e,f);d[12]=a.x;d[13]=a.y;d[14]=a.z;return this},decompose:function(a,b,c){var d=this.elements,e=THREE.Matrix4.__v1,f=THREE.Matrix4.__v2,g=THREE.Matrix4.__v3;e.set(d[0],d[1],d[2]);f.set(d[4],d[5],d[6]);g.set(d[8],d[9],d[10]);a=a instanceof THREE.Vector3?a:new THREE.Vector3;b=b instanceof THREE.Quaternion?b:new THREE.Quaternion;c=c instanceof THREE.Vector3?c:new THREE.Vector3;
c.x=e.length();c.y=f.length();c.z=g.length();a.x=d[12];a.y=d[13];a.z=d[14];d=THREE.Matrix4.__m1;d.copy(this);d.elements[0]=d.elements[0]/c.x;d.elements[1]=d.elements[1]/c.x;d.elements[2]=d.elements[2]/c.x;d.elements[4]=d.elements[4]/c.y;d.elements[5]=d.elements[5]/c.y;d.elements[6]=d.elements[6]/c.y;d.elements[8]=d.elements[8]/c.z;d.elements[9]=d.elements[9]/c.z;d.elements[10]=d.elements[10]/c.z;b.setFromRotationMatrix(d);return[a,b,c]},extractPosition:function(a){var b=this.elements,a=a.elements;
b[12]=a[12];b[13]=a[13];b[14]=a[14];return this},extractRotation:function(a){var b=this.elements,a=a.elements,c=THREE.Matrix4.__v1,d=1/c.set(a[0],a[1],a[2]).length(),e=1/c.set(a[4],a[5],a[6]).length(),c=1/c.set(a[8],a[9],a[10]).length();b[0]=a[0]*d;b[1]=a[1]*d;b[2]=a[2]*d;b[4]=a[4]*e;b[5]=a[5]*e;b[6]=a[6]*e;b[8]=a[8]*c;b[9]=a[9]*c;b[10]=a[10]*c;return this},translate:function(a){var b=this.elements,c=a.x,d=a.y,a=a.z;b[12]=b[0]*c+b[4]*d+b[8]*a+b[12];b[13]=b[1]*c+b[5]*d+b[9]*a+b[13];b[14]=b[2]*c+b[6]*
d+b[10]*a+b[14];b[15]=b[3]*c+b[7]*d+b[11]*a+b[15];return this},rotateX:function(a){var b=this.elements,c=b[4],d=b[5],e=b[6],f=b[7],g=b[8],h=b[9],j=b[10],k=b[11],l=Math.cos(a),a=Math.sin(a);b[4]=l*c+a*g;b[5]=l*d+a*h;b[6]=l*e+a*j;b[7]=l*f+a*k;b[8]=l*g-a*c;b[9]=l*h-a*d;b[10]=l*j-a*e;b[11]=l*k-a*f;return this},rotateY:function(a){var b=this.elements,c=b[0],d=b[1],e=b[2],f=b[3],g=b[8],h=b[9],j=b[10],k=b[11],l=Math.cos(a),a=Math.sin(a);b[0]=l*c-a*g;b[1]=l*d-a*h;b[2]=l*e-a*j;b[3]=l*f-a*k;b[8]=l*g+a*c;b[9]=
l*h+a*d;b[10]=l*j+a*e;b[11]=l*k+a*f;return this},rotateZ:function(a){var b=this.elements,c=b[0],d=b[1],e=b[2],f=b[3],g=b[4],h=b[5],j=b[6],k=b[7],l=Math.cos(a),a=Math.sin(a);b[0]=l*c+a*g;b[1]=l*d+a*h;b[2]=l*e+a*j;b[3]=l*f+a*k;b[4]=l*g-a*c;b[5]=l*h-a*d;b[6]=l*j-a*e;b[7]=l*k-a*f;return this},rotateByAxis:function(a,b){var c=this.elements;if(a.x===1&&a.y===0&&a.z===0)return this.rotateX(b);if(a.x===0&&a.y===1&&a.z===0)return this.rotateY(b);if(a.x===0&&a.y===0&&a.z===1)return this.rotateZ(b);var d=a.x,
e=a.y,f=a.z,g=Math.sqrt(d*d+e*e+f*f),d=d/g,e=e/g,f=f/g,g=d*d,h=e*e,j=f*f,k=Math.cos(b),l=Math.sin(b),o=1-k,m=d*e*o,p=d*f*o,o=e*f*o,d=d*l,r=e*l,l=f*l,f=g+(1-g)*k,g=m+l,e=p-r,m=m-l,h=h+(1-h)*k,l=o+d,p=p+r,o=o-d,j=j+(1-j)*k,k=c[0],d=c[1],r=c[2],n=c[3],q=c[4],u=c[5],t=c[6],y=c[7],s=c[8],x=c[9],E=c[10],D=c[11];c[0]=f*k+g*q+e*s;c[1]=f*d+g*u+e*x;c[2]=f*r+g*t+e*E;c[3]=f*n+g*y+e*D;c[4]=m*k+h*q+l*s;c[5]=m*d+h*u+l*x;c[6]=m*r+h*t+l*E;c[7]=m*n+h*y+l*D;c[8]=p*k+o*q+j*s;c[9]=p*d+o*u+j*x;c[10]=p*r+o*t+j*E;c[11]=
p*n+o*y+j*D;return this},scale:function(a){var b=this.elements,c=a.x,d=a.y,a=a.z;b[0]=b[0]*c;b[4]=b[4]*d;b[8]=b[8]*a;b[1]=b[1]*c;b[5]=b[5]*d;b[9]=b[9]*a;b[2]=b[2]*c;b[6]=b[6]*d;b[10]=b[10]*a;b[3]=b[3]*c;b[7]=b[7]*d;b[11]=b[11]*a;return this},getMaxScaleOnAxis:function(){var a=this.elements;return Math.sqrt(Math.max(a[0]*a[0]+a[1]*a[1]+a[2]*a[2],Math.max(a[4]*a[4]+a[5]*a[5]+a[6]*a[6],a[8]*a[8]+a[9]*a[9]+a[10]*a[10])))},makeTranslation:function(a,b,c){this.set(1,0,0,a,0,1,0,b,0,0,1,c,0,0,0,1);return this},
makeRotationX:function(a){var b=Math.cos(a),a=Math.sin(a);this.set(1,0,0,0,0,b,-a,0,0,a,b,0,0,0,0,1);return this},makeRotationY:function(a){var b=Math.cos(a),a=Math.sin(a);this.set(b,0,a,0,0,1,0,0,-a,0,b,0,0,0,0,1);return this},makeRotationZ:function(a){var b=Math.cos(a),a=Math.sin(a);this.set(b,-a,0,0,a,b,0,0,0,0,1,0,0,0,0,1);return this},makeRotationAxis:function(a,b){var c=Math.cos(b),d=Math.sin(b),e=1-c,f=a.x,g=a.y,h=a.z,j=e*f,k=e*g;this.set(j*f+c,j*g-d*h,j*h+d*g,0,j*g+d*h,k*g+c,k*h-d*f,0,j*h-
d*g,k*h+d*f,e*h*h+c,0,0,0,0,1);return this},makeScale:function(a,b,c){this.set(a,0,0,0,0,b,0,0,0,0,c,0,0,0,0,1);return this},makeFrustum:function(a,b,c,d,e,f){var g=this.elements;g[0]=2*e/(b-a);g[4]=0;g[8]=(b+a)/(b-a);g[12]=0;g[1]=0;g[5]=2*e/(d-c);g[9]=(d+c)/(d-c);g[13]=0;g[2]=0;g[6]=0;g[10]=-(f+e)/(f-e);g[14]=-2*f*e/(f-e);g[3]=0;g[7]=0;g[11]=-1;g[15]=0;return this},makePerspective:function(a,b,c,d){var a=c*Math.tan(a*Math.PI/360),e=-a;return this.makeFrustum(e*b,a*b,e,a,c,d)},makeOrthographic:function(a,
b,c,d,e,f){var g=this.elements,h=b-a,j=c-d,k=f-e;g[0]=2/h;g[4]=0;g[8]=0;g[12]=-((b+a)/h);g[1]=0;g[5]=2/j;g[9]=0;g[13]=-((c+d)/j);g[2]=0;g[6]=0;g[10]=-2/k;g[14]=-((f+e)/k);g[3]=0;g[7]=0;g[11]=0;g[15]=1;return this},clone:function(){var a=this.elements;return new THREE.Matrix4(a[0],a[4],a[8],a[12],a[1],a[5],a[9],a[13],a[2],a[6],a[10],a[14],a[3],a[7],a[11],a[15])}};THREE.Matrix4.__v1=new THREE.Vector3;THREE.Matrix4.__v2=new THREE.Vector3;THREE.Matrix4.__v3=new THREE.Vector3;THREE.Matrix4.__m1=new THREE.Matrix4;
THREE.Matrix4.__m2=new THREE.Matrix4;
THREE.Object3D=function(){this.id=THREE.Object3DCount++;this.name="";this.parent=void 0;this.children=[];this.up=new THREE.Vector3(0,1,0);this.position=new THREE.Vector3;this.rotation=new THREE.Vector3;this.eulerOrder="XYZ";this.scale=new THREE.Vector3(1,1,1);this.flipSided=this.doubleSided=false;this.renderDepth=null;this.rotationAutoUpdate=true;this.matrix=new THREE.Matrix4;this.matrixWorld=new THREE.Matrix4;this.matrixRotationWorld=new THREE.Matrix4;this.matrixWorldNeedsUpdate=this.matrixAutoUpdate=
true;this.quaternion=new THREE.Quaternion;this.useQuaternion=false;this.boundRadius=0;this.boundRadiusScale=1;this.visible=true;this.receiveShadow=this.castShadow=false;this.frustumCulled=true;this._vector=new THREE.Vector3};
THREE.Object3D.prototype={constructor:THREE.Object3D,applyMatrix:function(a){this.matrix.multiply(a,this.matrix);this.scale.getScaleFromMatrix(this.matrix);this.rotation.getRotationFromMatrix(this.matrix,this.scale);this.position.getPositionFromMatrix(this.matrix)},translate:function(a,b){this.matrix.rotateAxis(b);this.position.addSelf(b.multiplyScalar(a))},translateX:function(a){this.translate(a,this._vector.set(1,0,0))},translateY:function(a){this.translate(a,this._vector.set(0,1,0))},translateZ:function(a){this.translate(a,
this._vector.set(0,0,1))},lookAt:function(a){this.matrix.lookAt(a,this.position,this.up);this.rotationAutoUpdate&&this.rotation.getRotationFromMatrix(this.matrix)},add:function(a){if(a===this)console.warn("THREE.Object3D.add: An object can't be added as a child of itself.");else if(a instanceof THREE.Object3D){a.parent!==void 0&&a.parent.remove(a);a.parent=this;this.children.push(a);for(var b=this;b.parent!==void 0;)b=b.parent;b!==void 0&&b instanceof THREE.Scene&&b.__addObject(a)}},remove:function(a){var b=
this.children.indexOf(a);if(b!==-1){a.parent=void 0;this.children.splice(b,1);for(b=this;b.parent!==void 0;)b=b.parent;b!==void 0&&b instanceof THREE.Scene&&b.__removeObject(a)}},getChildByName:function(a,b){var c,d,e;c=0;for(d=this.children.length;c<d;c++){e=this.children[c];if(e.name===a)return e;if(b){e=e.getChildByName(a,b);if(e!==void 0)return e}}},updateMatrix:function(){this.matrix.setPosition(this.position);this.useQuaternion?this.matrix.setRotationFromQuaternion(this.quaternion):this.matrix.setRotationFromEuler(this.rotation,
this.eulerOrder);if(this.scale.x!==1||this.scale.y!==1||this.scale.z!==1){this.matrix.scale(this.scale);this.boundRadiusScale=Math.max(this.scale.x,Math.max(this.scale.y,this.scale.z))}this.matrixWorldNeedsUpdate=true},updateMatrixWorld:function(a){this.matrixAutoUpdate&&this.updateMatrix();if(this.matrixWorldNeedsUpdate||a){this.parent?this.matrixWorld.multiply(this.parent.matrixWorld,this.matrix):this.matrixWorld.copy(this.matrix);this.matrixWorldNeedsUpdate=false;a=true}for(var b=0,c=this.children.length;b<
c;b++)this.children[b].updateMatrixWorld(a)},worldToLocal:function(a){return THREE.Object3D.__m1.getInverse(this.matrixWorld).multiplyVector3(a)},localToWorld:function(a){return this.matrixWorld.multiplyVector3(a)}};THREE.Object3D.__m1=new THREE.Matrix4;THREE.Object3DCount=0;
THREE.Projector=function(){function a(){var a=g[f]=g[f]||new THREE.RenderableObject;f++;return a}function b(){var a=k[j]=k[j]||new THREE.RenderableVertex;j++;return a}function c(a,b){return b.z-a.z}function d(a,b){var c=0,d=1,e=a.z+a.w,f=b.z+b.w,g=-a.z+a.w,h=-b.z+b.w;if(e>=0&&f>=0&&g>=0&&h>=0)return true;if(e<0&&f<0||g<0&&h<0)return false;e<0?c=Math.max(c,e/(e-f)):f<0&&(d=Math.min(d,e/(e-f)));g<0?c=Math.max(c,g/(g-h)):h<0&&(d=Math.min(d,g/(g-h)));if(d<c)return false;a.lerpSelf(b,c);b.lerpSelf(a,1-
d);return true}var e,f,g=[],h,j,k=[],l,o,m=[],p,r=[],n,q,u=[],t,y,s=[],x={objects:[],sprites:[],lights:[],elements:[]},E=new THREE.Vector3,D=new THREE.Vector4,A=new THREE.Matrix4,v=new THREE.Matrix4,H=new THREE.Frustum,I=new THREE.Vector4,M=new THREE.Vector4;this.projectVector=function(a,b){b.matrixWorldInverse.getInverse(b.matrixWorld);A.multiply(b.projectionMatrix,b.matrixWorldInverse);A.multiplyVector3(a);return a};this.unprojectVector=function(a,b){b.projectionMatrixInverse.getInverse(b.projectionMatrix);
A.multiply(b.matrixWorld,b.projectionMatrixInverse);A.multiplyVector3(a);return a};this.pickingRay=function(a,b){var c;a.z=-1;c=new THREE.Vector3(a.x,a.y,1);this.unprojectVector(a,b);this.unprojectVector(c,b);c.subSelf(a).normalize();return new THREE.Ray(a,c)};this.projectGraph=function(b,d){f=0;x.objects.length=0;x.sprites.length=0;x.lights.length=0;var g=function(b){if(b.visible!==false){if((b instanceof THREE.Mesh||b instanceof THREE.Line)&&(b.frustumCulled===false||H.contains(b))){E.copy(b.matrixWorld.getPosition());
A.multiplyVector3(E);e=a();e.object=b;e.z=E.z;x.objects.push(e)}else if(b instanceof THREE.Sprite||b instanceof THREE.Particle){E.copy(b.matrixWorld.getPosition());A.multiplyVector3(E);e=a();e.object=b;e.z=E.z;x.sprites.push(e)}else b instanceof THREE.Light&&x.lights.push(b);for(var c=0,d=b.children.length;c<d;c++)g(b.children[c])}};g(b);d&&x.objects.sort(c);return x};this.projectScene=function(a,e,f){var g=e.near,E=e.far,C=false,i,P,L,S,aa,N,ca,fa,O,$,U,Y,ha,Sa,Ma;y=q=p=o=0;x.elements.length=0;if(e.parent===
void 0){console.warn("DEPRECATED: Camera hasn't been added to a Scene. Adding it...");a.add(e)}a.updateMatrixWorld();e.matrixWorldInverse.getInverse(e.matrixWorld);A.multiply(e.projectionMatrix,e.matrixWorldInverse);H.setFromMatrix(A);x=this.projectGraph(a,false);a=0;for(i=x.objects.length;a<i;a++){O=x.objects[a].object;$=O.matrixWorld;j=0;if(O instanceof THREE.Mesh){U=O.geometry;Y=O.geometry.materials;S=U.vertices;ha=U.faces;Sa=U.faceVertexUvs;U=O.matrixRotationWorld.extractRotation($);P=0;for(L=
S.length;P<L;P++){h=b();h.positionWorld.copy(S[P]);$.multiplyVector3(h.positionWorld);h.positionScreen.copy(h.positionWorld);A.multiplyVector4(h.positionScreen);h.positionScreen.x=h.positionScreen.x/h.positionScreen.w;h.positionScreen.y=h.positionScreen.y/h.positionScreen.w;h.visible=h.positionScreen.z>g&&h.positionScreen.z<E}S=0;for(P=ha.length;S<P;S++){L=ha[S];if(L instanceof THREE.Face3){aa=k[L.a];N=k[L.b];ca=k[L.c];if(aa.visible&&N.visible&&ca.visible){C=(ca.positionScreen.x-aa.positionScreen.x)*
(N.positionScreen.y-aa.positionScreen.y)-(ca.positionScreen.y-aa.positionScreen.y)*(N.positionScreen.x-aa.positionScreen.x)<0;if(O.doubleSided||C!=O.flipSided){fa=m[o]=m[o]||new THREE.RenderableFace3;o++;l=fa;l.v1.copy(aa);l.v2.copy(N);l.v3.copy(ca)}else continue}else continue}else if(L instanceof THREE.Face4){aa=k[L.a];N=k[L.b];ca=k[L.c];fa=k[L.d];if(aa.visible&&N.visible&&ca.visible&&fa.visible){C=(fa.positionScreen.x-aa.positionScreen.x)*(N.positionScreen.y-aa.positionScreen.y)-(fa.positionScreen.y-
aa.positionScreen.y)*(N.positionScreen.x-aa.positionScreen.x)<0||(N.positionScreen.x-ca.positionScreen.x)*(fa.positionScreen.y-ca.positionScreen.y)-(N.positionScreen.y-ca.positionScreen.y)*(fa.positionScreen.x-ca.positionScreen.x)<0;if(O.doubleSided||C!=O.flipSided){Ma=r[p]=r[p]||new THREE.RenderableFace4;p++;l=Ma;l.v1.copy(aa);l.v2.copy(N);l.v3.copy(ca);l.v4.copy(fa)}else continue}else continue}l.normalWorld.copy(L.normal);!C&&(O.flipSided||O.doubleSided)&&l.normalWorld.negate();U.multiplyVector3(l.normalWorld);
l.centroidWorld.copy(L.centroid);$.multiplyVector3(l.centroidWorld);l.centroidScreen.copy(l.centroidWorld);A.multiplyVector3(l.centroidScreen);ca=L.vertexNormals;aa=0;for(N=ca.length;aa<N;aa++){fa=l.vertexNormalsWorld[aa];fa.copy(ca[aa]);!C&&(O.flipSided||O.doubleSided)&&fa.negate();U.multiplyVector3(fa)}aa=0;for(N=Sa.length;aa<N;aa++)if(Ma=Sa[aa][S]){ca=0;for(fa=Ma.length;ca<fa;ca++)l.uvs[aa][ca]=Ma[ca]}l.material=O.material;l.faceMaterial=L.materialIndex!==null?Y[L.materialIndex]:null;l.z=l.centroidScreen.z;
x.elements.push(l)}}else if(O instanceof THREE.Line){v.multiply(A,$);S=O.geometry.vertices;aa=b();aa.positionScreen.copy(S[0]);v.multiplyVector4(aa.positionScreen);$=O.type===THREE.LinePieces?2:1;P=1;for(L=S.length;P<L;P++){aa=b();aa.positionScreen.copy(S[P]);v.multiplyVector4(aa.positionScreen);if(!((P+1)%$>0)){N=k[j-2];I.copy(aa.positionScreen);M.copy(N.positionScreen);if(d(I,M)){I.multiplyScalar(1/I.w);M.multiplyScalar(1/M.w);Y=u[q]=u[q]||new THREE.RenderableLine;q++;n=Y;n.v1.positionScreen.copy(I);
n.v2.positionScreen.copy(M);n.z=Math.max(I.z,M.z);n.material=O.material;x.elements.push(n)}}}}}a=0;for(i=x.sprites.length;a<i;a++){O=x.sprites[a].object;$=O.matrixWorld;if(O instanceof THREE.Particle){D.set($.elements[12],$.elements[13],$.elements[14],1);A.multiplyVector4(D);D.z=D.z/D.w;if(D.z>0&&D.z<1){g=s[y]=s[y]||new THREE.RenderableParticle;y++;t=g;t.x=D.x/D.w;t.y=D.y/D.w;t.z=D.z;t.rotation=O.rotation.z;t.scale.x=O.scale.x*Math.abs(t.x-(D.x+e.projectionMatrix.elements[0])/(D.w+e.projectionMatrix.elements[12]));
t.scale.y=O.scale.y*Math.abs(t.y-(D.y+e.projectionMatrix.elements[5])/(D.w+e.projectionMatrix.elements[13]));t.material=O.material;x.elements.push(t)}}}f&&x.elements.sort(c);return x}};THREE.Quaternion=function(a,b,c,d){this.x=a||0;this.y=b||0;this.z=c||0;this.w=d!==void 0?d:1};
THREE.Quaternion.prototype={constructor:THREE.Quaternion,set:function(a,b,c,d){this.x=a;this.y=b;this.z=c;this.w=d;return this},copy:function(a){this.x=a.x;this.y=a.y;this.z=a.z;this.w=a.w;return this},setFromEuler:function(a){var b=Math.PI/360,c=a.x*b,d=a.y*b,e=a.z*b,a=Math.cos(d),d=Math.sin(d),b=Math.cos(-e),e=Math.sin(-e),f=Math.cos(c),c=Math.sin(c),g=a*b,h=d*e;this.w=g*f-h*c;this.x=g*c+h*f;this.y=d*b*f+a*e*c;this.z=a*e*f-d*b*c;return this},setFromAxisAngle:function(a,b){var c=b/2,d=Math.sin(c);
this.x=a.x*d;this.y=a.y*d;this.z=a.z*d;this.w=Math.cos(c);return this},setFromRotationMatrix:function(a){var b=Math.pow(a.determinant(),1/3);this.w=Math.sqrt(Math.max(0,b+a.elements[0]+a.elements[5]+a.elements[10]))/2;this.x=Math.sqrt(Math.max(0,b+a.elements[0]-a.elements[5]-a.elements[10]))/2;this.y=Math.sqrt(Math.max(0,b-a.elements[0]+a.elements[5]-a.elements[10]))/2;this.z=Math.sqrt(Math.max(0,b-a.elements[0]-a.elements[5]+a.elements[10]))/2;this.x=a.elements[6]-a.elements[9]<0?-Math.abs(this.x):
Math.abs(this.x);this.y=a.elements[8]-a.elements[2]<0?-Math.abs(this.y):Math.abs(this.y);this.z=a.elements[1]-a.elements[4]<0?-Math.abs(this.z):Math.abs(this.z);this.normalize();return this},calculateW:function(){this.w=-Math.sqrt(Math.abs(1-this.x*this.x-this.y*this.y-this.z*this.z));return this},inverse:function(){this.x=this.x*-1;this.y=this.y*-1;this.z=this.z*-1;return this},length:function(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)},normalize:function(){var a=
Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w);if(a===0)this.w=this.z=this.y=this.x=0;else{a=1/a;this.x=this.x*a;this.y=this.y*a;this.z=this.z*a;this.w=this.w*a}return this},multiply:function(a,b){this.x=a.x*b.w+a.y*b.z-a.z*b.y+a.w*b.x;this.y=-a.x*b.z+a.y*b.w+a.z*b.x+a.w*b.y;this.z=a.x*b.y-a.y*b.x+a.z*b.w+a.w*b.z;this.w=-a.x*b.x-a.y*b.y-a.z*b.z+a.w*b.w;return this},multiplySelf:function(a){var b=this.x,c=this.y,d=this.z,e=this.w,f=a.x,g=a.y,h=a.z,a=a.w;this.x=b*a+e*f+c*h-d*g;this.y=
c*a+e*g+d*f-b*h;this.z=d*a+e*h+b*g-c*f;this.w=e*a-b*f-c*g-d*h;return this},multiplyVector3:function(a,b){b||(b=a);var c=a.x,d=a.y,e=a.z,f=this.x,g=this.y,h=this.z,j=this.w,k=j*c+g*e-h*d,l=j*d+h*c-f*e,o=j*e+f*d-g*c,c=-f*c-g*d-h*e;b.x=k*j+c*-f+l*-h-o*-g;b.y=l*j+c*-g+o*-f-k*-h;b.z=o*j+c*-h+k*-g-l*-f;return b},slerpSelf:function(a,b){var c=this.x,d=this.y,e=this.z,f=this.w,g=f*a.w+c*a.x+d*a.y+e*a.z;if(g<0){this.w=-a.w;this.x=-a.x;this.y=-a.y;this.z=-a.z;g=-g}else this.copy(a);if(g>=1){this.w=f;this.x=
c;this.y=d;this.z=e;return this}var h=Math.acos(g),j=Math.sqrt(1-g*g);if(Math.abs(j)<0.001){this.w=0.5*(f+this.w);this.x=0.5*(c+this.x);this.y=0.5*(d+this.y);this.z=0.5*(e+this.z);return this}g=Math.sin((1-b)*h)/j;h=Math.sin(b*h)/j;this.w=f*g+this.w*h;this.x=c*g+this.x*h;this.y=d*g+this.y*h;this.z=e*g+this.z*h;return this},clone:function(){return new THREE.Quaternion(this.x,this.y,this.z,this.w)}};
THREE.Quaternion.slerp=function(a,b,c,d){var e=a.w*b.w+a.x*b.x+a.y*b.y+a.z*b.z;if(e<0){c.w=-b.w;c.x=-b.x;c.y=-b.y;c.z=-b.z;e=-e}else c.copy(b);if(Math.abs(e)>=1){c.w=a.w;c.x=a.x;c.y=a.y;c.z=a.z;return c}var b=Math.acos(e),f=Math.sqrt(1-e*e);if(Math.abs(f)<0.001){c.w=0.5*(a.w+c.w);c.x=0.5*(a.x+c.x);c.y=0.5*(a.y+c.y);c.z=0.5*(a.z+c.z);return c}e=Math.sin((1-d)*b)/f;d=Math.sin(d*b)/f;c.w=a.w*e+c.w*d;c.x=a.x*e+c.x*d;c.y=a.y*e+c.y*d;c.z=a.z*e+c.z*d;return c};THREE.Vertex=function(){console.warn("THREE.Vertex has been DEPRECATED. Use THREE.Vector3 instead.")};
THREE.Face3=function(a,b,c,d,e,f){this.a=a;this.b=b;this.c=c;this.normal=d instanceof THREE.Vector3?d:new THREE.Vector3;this.vertexNormals=d instanceof Array?d:[];this.color=e instanceof THREE.Color?e:new THREE.Color;this.vertexColors=e instanceof Array?e:[];this.vertexTangents=[];this.materialIndex=f;this.centroid=new THREE.Vector3};
THREE.Face3.prototype={constructor:THREE.Face3,clone:function(){var a=new THREE.Face3(this.a,this.b,this.c);a.normal.copy(this.normal);a.color.copy(this.color);a.centroid.copy(this.centroid);a.materialIndex=this.materialIndex;var b,c;b=0;for(c=this.vertexNormals.length;b<c;b++)a.vertexNormals[b]=this.vertexNormals[b].clone();b=0;for(c=this.vertexColors.length;b<c;b++)a.vertexColors[b]=this.vertexColors[b].clone();b=0;for(c=this.vertexTangents.length;b<c;b++)a.vertexTangents[b]=this.vertexTangents[b].clone();
return a}};THREE.Face4=function(a,b,c,d,e,f,g){this.a=a;this.b=b;this.c=c;this.d=d;this.normal=e instanceof THREE.Vector3?e:new THREE.Vector3;this.vertexNormals=e instanceof Array?e:[];this.color=f instanceof THREE.Color?f:new THREE.Color;this.vertexColors=f instanceof Array?f:[];this.vertexTangents=[];this.materialIndex=g;this.centroid=new THREE.Vector3};
THREE.Face4.prototype={constructor:THREE.Face4,clone:function(){var a=new THREE.Face4(this.a,this.b,this.c,this.d);a.normal.copy(this.normal);a.color.copy(this.color);a.centroid.copy(this.centroid);a.materialIndex=this.materialIndex;var b,c;b=0;for(c=this.vertexNormals.length;b<c;b++)a.vertexNormals[b]=this.vertexNormals[b].clone();b=0;for(c=this.vertexColors.length;b<c;b++)a.vertexColors[b]=this.vertexColors[b].clone();b=0;for(c=this.vertexTangents.length;b<c;b++)a.vertexTangents[b]=this.vertexTangents[b].clone();
return a}};THREE.UV=function(a,b){this.u=a||0;this.v=b||0};THREE.UV.prototype={constructor:THREE.UV,set:function(a,b){this.u=a;this.v=b;return this},copy:function(a){this.u=a.u;this.v=a.v;return this},lerpSelf:function(a,b){this.u=this.u+(a.u-this.u)*b;this.v=this.v+(a.v-this.v)*b;return this},clone:function(){return new THREE.UV(this.u,this.v)}};
THREE.Geometry=function(){this.id=THREE.GeometryCount++;this.vertices=[];this.colors=[];this.materials=[];this.faces=[];this.faceUvs=[[]];this.faceVertexUvs=[[]];this.morphTargets=[];this.morphColors=[];this.morphNormals=[];this.skinWeights=[];this.skinIndices=[];this.boundingSphere=this.boundingBox=null;this.dynamic=this.hasTangents=false};
THREE.Geometry.prototype={constructor:THREE.Geometry,applyMatrix:function(a){var b=new THREE.Matrix4;b.extractRotation(a);for(var c=0,d=this.vertices.length;c<d;c++)a.multiplyVector3(this.vertices[c]);c=0;for(d=this.faces.length;c<d;c++){var e=this.faces[c];b.multiplyVector3(e.normal);for(var f=0,g=e.vertexNormals.length;f<g;f++)b.multiplyVector3(e.vertexNormals[f]);a.multiplyVector3(e.centroid)}},computeCentroids:function(){var a,b,c;a=0;for(b=this.faces.length;a<b;a++){c=this.faces[a];c.centroid.set(0,
0,0);if(c instanceof THREE.Face3){c.centroid.addSelf(this.vertices[c.a]);c.centroid.addSelf(this.vertices[c.b]);c.centroid.addSelf(this.vertices[c.c]);c.centroid.divideScalar(3)}else if(c instanceof THREE.Face4){c.centroid.addSelf(this.vertices[c.a]);c.centroid.addSelf(this.vertices[c.b]);c.centroid.addSelf(this.vertices[c.c]);c.centroid.addSelf(this.vertices[c.d]);c.centroid.divideScalar(4)}}},computeFaceNormals:function(){var a,b,c,d,e,f,g=new THREE.Vector3,h=new THREE.Vector3;a=0;for(b=this.faces.length;a<
b;a++){c=this.faces[a];d=this.vertices[c.a];e=this.vertices[c.b];f=this.vertices[c.c];g.sub(f,e);h.sub(d,e);g.crossSelf(h);g.isZero()||g.normalize();c.normal.copy(g)}},computeVertexNormals:function(){var a,b,c,d;if(this.__tmpVertices===void 0){d=this.__tmpVertices=Array(this.vertices.length);a=0;for(b=this.vertices.length;a<b;a++)d[a]=new THREE.Vector3;a=0;for(b=this.faces.length;a<b;a++){c=this.faces[a];if(c instanceof THREE.Face3)c.vertexNormals=[new THREE.Vector3,new THREE.Vector3,new THREE.Vector3];
else if(c instanceof THREE.Face4)c.vertexNormals=[new THREE.Vector3,new THREE.Vector3,new THREE.Vector3,new THREE.Vector3]}}else{d=this.__tmpVertices;a=0;for(b=this.vertices.length;a<b;a++)d[a].set(0,0,0)}a=0;for(b=this.faces.length;a<b;a++){c=this.faces[a];if(c instanceof THREE.Face3){d[c.a].addSelf(c.normal);d[c.b].addSelf(c.normal);d[c.c].addSelf(c.normal)}else if(c instanceof THREE.Face4){d[c.a].addSelf(c.normal);d[c.b].addSelf(c.normal);d[c.c].addSelf(c.normal);d[c.d].addSelf(c.normal)}}a=0;
for(b=this.vertices.length;a<b;a++)d[a].normalize();a=0;for(b=this.faces.length;a<b;a++){c=this.faces[a];if(c instanceof THREE.Face3){c.vertexNormals[0].copy(d[c.a]);c.vertexNormals[1].copy(d[c.b]);c.vertexNormals[2].copy(d[c.c])}else if(c instanceof THREE.Face4){c.vertexNormals[0].copy(d[c.a]);c.vertexNormals[1].copy(d[c.b]);c.vertexNormals[2].copy(d[c.c]);c.vertexNormals[3].copy(d[c.d])}}},computeMorphNormals:function(){var a,b,c,d,e;c=0;for(d=this.faces.length;c<d;c++){e=this.faces[c];e.__originalFaceNormal?
e.__originalFaceNormal.copy(e.normal):e.__originalFaceNormal=e.normal.clone();if(!e.__originalVertexNormals)e.__originalVertexNormals=[];a=0;for(b=e.vertexNormals.length;a<b;a++)e.__originalVertexNormals[a]?e.__originalVertexNormals[a].copy(e.vertexNormals[a]):e.__originalVertexNormals[a]=e.vertexNormals[a].clone()}var f=new THREE.Geometry;f.faces=this.faces;a=0;for(b=this.morphTargets.length;a<b;a++){if(!this.morphNormals[a]){this.morphNormals[a]={};this.morphNormals[a].faceNormals=[];this.morphNormals[a].vertexNormals=
[];var g=this.morphNormals[a].faceNormals,h=this.morphNormals[a].vertexNormals,j,k;c=0;for(d=this.faces.length;c<d;c++){e=this.faces[c];j=new THREE.Vector3;k=e instanceof THREE.Face3?{a:new THREE.Vector3,b:new THREE.Vector3,c:new THREE.Vector3}:{a:new THREE.Vector3,b:new THREE.Vector3,c:new THREE.Vector3,d:new THREE.Vector3};g.push(j);h.push(k)}}g=this.morphNormals[a];f.vertices=this.morphTargets[a].vertices;f.computeFaceNormals();f.computeVertexNormals();c=0;for(d=this.faces.length;c<d;c++){e=this.faces[c];
j=g.faceNormals[c];k=g.vertexNormals[c];j.copy(e.normal);if(e instanceof THREE.Face3){k.a.copy(e.vertexNormals[0]);k.b.copy(e.vertexNormals[1]);k.c.copy(e.vertexNormals[2])}else{k.a.copy(e.vertexNormals[0]);k.b.copy(e.vertexNormals[1]);k.c.copy(e.vertexNormals[2]);k.d.copy(e.vertexNormals[3])}}}c=0;for(d=this.faces.length;c<d;c++){e=this.faces[c];e.normal=e.__originalFaceNormal;e.vertexNormals=e.__originalVertexNormals}},computeTangents:function(){function a(a,b,c,d,e,f,A){h=a.vertices[b];j=a.vertices[c];
k=a.vertices[d];l=g[e];o=g[f];m=g[A];p=j.x-h.x;r=k.x-h.x;n=j.y-h.y;q=k.y-h.y;u=j.z-h.z;t=k.z-h.z;y=o.u-l.u;s=m.u-l.u;x=o.v-l.v;E=m.v-l.v;D=1/(y*E-s*x);I.set((E*p-x*r)*D,(E*n-x*q)*D,(E*u-x*t)*D);M.set((y*r-s*p)*D,(y*q-s*n)*D,(y*t-s*u)*D);v[b].addSelf(I);v[c].addSelf(I);v[d].addSelf(I);H[b].addSelf(M);H[c].addSelf(M);H[d].addSelf(M)}var b,c,d,e,f,g,h,j,k,l,o,m,p,r,n,q,u,t,y,s,x,E,D,A,v=[],H=[],I=new THREE.Vector3,M=new THREE.Vector3,R=new THREE.Vector3,Z=new THREE.Vector3,B=new THREE.Vector3;b=0;for(c=
this.vertices.length;b<c;b++){v[b]=new THREE.Vector3;H[b]=new THREE.Vector3}b=0;for(c=this.faces.length;b<c;b++){f=this.faces[b];g=this.faceVertexUvs[0][b];if(f instanceof THREE.Face3)a(this,f.a,f.b,f.c,0,1,2);else if(f instanceof THREE.Face4){a(this,f.a,f.b,f.d,0,1,3);a(this,f.b,f.c,f.d,1,2,3)}}var G=["a","b","c","d"];b=0;for(c=this.faces.length;b<c;b++){f=this.faces[b];for(d=0;d<f.vertexNormals.length;d++){B.copy(f.vertexNormals[d]);e=f[G[d]];A=v[e];R.copy(A);R.subSelf(B.multiplyScalar(B.dot(A))).normalize();
Z.cross(f.vertexNormals[d],A);e=Z.dot(H[e]);e=e<0?-1:1;f.vertexTangents[d]=new THREE.Vector4(R.x,R.y,R.z,e)}}this.hasTangents=true},computeBoundingBox:function(){if(!this.boundingBox)this.boundingBox={min:new THREE.Vector3,max:new THREE.Vector3};if(this.vertices.length>0){var a;a=this.vertices[0];this.boundingBox.min.copy(a);this.boundingBox.max.copy(a);for(var b=this.boundingBox.min,c=this.boundingBox.max,d=1,e=this.vertices.length;d<e;d++){a=this.vertices[d];if(a.x<b.x)b.x=a.x;else if(a.x>c.x)c.x=
a.x;if(a.y<b.y)b.y=a.y;else if(a.y>c.y)c.y=a.y;if(a.z<b.z)b.z=a.z;else if(a.z>c.z)c.z=a.z}}else{this.boundingBox.min.set(0,0,0);this.boundingBox.max.set(0,0,0)}},computeBoundingSphere:function(){if(!this.boundingSphere)this.boundingSphere={radius:0};for(var a,b=0,c=0,d=this.vertices.length;c<d;c++){a=this.vertices[c].length();a>b&&(b=a)}this.boundingSphere.radius=b},mergeVertices:function(){var a={},b=[],c=[],d,e=Math.pow(10,4),f,g,h;f=0;for(g=this.vertices.length;f<g;f++){d=this.vertices[f];d=[Math.round(d.x*
e),Math.round(d.y*e),Math.round(d.z*e)].join("_");if(a[d]===void 0){a[d]=f;b.push(this.vertices[f]);c[f]=b.length-1}else c[f]=c[a[d]]}f=0;for(g=this.faces.length;f<g;f++){e=this.faces[f];if(e instanceof THREE.Face3){e.a=c[e.a];e.b=c[e.b];e.c=c[e.c]}else if(e instanceof THREE.Face4){e.a=c[e.a];e.b=c[e.b];e.c=c[e.c];e.d=c[e.d];d=[e.a,e.b,e.c,e.d];for(a=3;a>0;a--)if(d.indexOf(e["abcd"[a]])!=a){d.splice(a,1);this.faces[f]=new THREE.Face3(d[0],d[1],d[2]);e=0;for(d=this.faceVertexUvs.length;e<d;e++)(h=
this.faceVertexUvs[e][f])&&h.splice(a,1);break}}}c=this.vertices.length-b.length;this.vertices=b;return c}};THREE.GeometryCount=0;
THREE.Spline=function(a){function b(a,b,c,d,e,f,g){a=(c-a)*0.5;d=(d-b)*0.5;return(2*(b-c)+a+d)*g+(-3*(b-c)-2*a-d)*f+a*e+b}this.points=a;var c=[],d={x:0,y:0,z:0},e,f,g,h,j,k,l,o,m;this.initFromArray=function(a){this.points=[];for(var b=0;b<a.length;b++)this.points[b]={x:a[b][0],y:a[b][1],z:a[b][2]}};this.getPoint=function(a){e=(this.points.length-1)*a;f=Math.floor(e);g=e-f;c[0]=f===0?f:f-1;c[1]=f;c[2]=f>this.points.length-2?this.points.length-1:f+1;c[3]=f>this.points.length-3?this.points.length-1:
f+2;k=this.points[c[0]];l=this.points[c[1]];o=this.points[c[2]];m=this.points[c[3]];h=g*g;j=g*h;d.x=b(k.x,l.x,o.x,m.x,g,h,j);d.y=b(k.y,l.y,o.y,m.y,g,h,j);d.z=b(k.z,l.z,o.z,m.z,g,h,j);return d};this.getControlPointsArray=function(){var a,b,c=this.points.length,d=[];for(a=0;a<c;a++){b=this.points[a];d[a]=[b.x,b.y,b.z]}return d};this.getLength=function(a){var b,c,d,e=b=b=0,f=new THREE.Vector3,g=new THREE.Vector3,h=[],j=0;h[0]=0;a||(a=100);c=this.points.length*a;f.copy(this.points[0]);for(a=1;a<c;a++){b=
a/c;d=this.getPoint(b);g.copy(d);j=j+g.distanceTo(f);f.copy(d);b=(this.points.length-1)*b;b=Math.floor(b);if(b!=e){h[b]=j;e=b}}h[h.length]=j;return{chunks:h,total:j}};this.reparametrizeByArcLength=function(a){var b,c,d,e,f,g,h=[],j=new THREE.Vector3,k=this.getLength();h.push(j.copy(this.points[0]).clone());for(b=1;b<this.points.length;b++){c=k.chunks[b]-k.chunks[b-1];g=Math.ceil(a*c/k.total);e=(b-1)/(this.points.length-1);f=b/(this.points.length-1);for(c=1;c<g-1;c++){d=e+c*(1/g)*(f-e);d=this.getPoint(d);
h.push(j.copy(d).clone())}h.push(j.copy(this.points[b]).clone())}this.points=h}};THREE.Camera=function(){THREE.Object3D.call(this);this.matrixWorldInverse=new THREE.Matrix4;this.projectionMatrix=new THREE.Matrix4;this.projectionMatrixInverse=new THREE.Matrix4};THREE.Camera.prototype=new THREE.Object3D;THREE.Camera.prototype.constructor=THREE.Camera;THREE.Camera.prototype.lookAt=function(a){this.matrix.lookAt(this.position,a,this.up);this.rotationAutoUpdate&&this.rotation.getRotationFromMatrix(this.matrix)};
THREE.OrthographicCamera=function(a,b,c,d,e,f){THREE.Camera.call(this);this.left=a;this.right=b;this.top=c;this.bottom=d;this.near=e!==void 0?e:0.1;this.far=f!==void 0?f:2E3;this.updateProjectionMatrix()};THREE.OrthographicCamera.prototype=new THREE.Camera;THREE.OrthographicCamera.prototype.constructor=THREE.OrthographicCamera;THREE.OrthographicCamera.prototype.updateProjectionMatrix=function(){this.projectionMatrix.makeOrthographic(this.left,this.right,this.top,this.bottom,this.near,this.far)};
THREE.PerspectiveCamera=function(a,b,c,d){THREE.Camera.call(this);this.fov=a!==void 0?a:50;this.aspect=b!==void 0?b:1;this.near=c!==void 0?c:0.1;this.far=d!==void 0?d:2E3;this.updateProjectionMatrix()};THREE.PerspectiveCamera.prototype=new THREE.Camera;THREE.PerspectiveCamera.prototype.constructor=THREE.PerspectiveCamera;THREE.PerspectiveCamera.prototype.setLens=function(a,b){this.fov=2*Math.atan((b!==void 0?b:24)/(a*2))*(180/Math.PI);this.updateProjectionMatrix()};
THREE.PerspectiveCamera.prototype.setViewOffset=function(a,b,c,d,e,f){this.fullWidth=a;this.fullHeight=b;this.x=c;this.y=d;this.width=e;this.height=f;this.updateProjectionMatrix()};
THREE.PerspectiveCamera.prototype.updateProjectionMatrix=function(){if(this.fullWidth){var a=this.fullWidth/this.fullHeight,b=Math.tan(this.fov*Math.PI/360)*this.near,c=-b,d=a*c,a=Math.abs(a*b-d),c=Math.abs(b-c);this.projectionMatrix.makeFrustum(d+this.x*a/this.fullWidth,d+(this.x+this.width)*a/this.fullWidth,b-(this.y+this.height)*c/this.fullHeight,b-this.y*c/this.fullHeight,this.near,this.far)}else this.projectionMatrix.makePerspective(this.fov,this.aspect,this.near,this.far)};
THREE.Light=function(a){THREE.Object3D.call(this);this.color=new THREE.Color(a)};THREE.Light.prototype=new THREE.Object3D;THREE.Light.prototype.constructor=THREE.Light;THREE.AmbientLight=function(a){THREE.Light.call(this,a)};THREE.AmbientLight.prototype=new THREE.Light;THREE.AmbientLight.prototype.constructor=THREE.AmbientLight;
THREE.DirectionalLight=function(a,b,c){THREE.Light.call(this,a);this.position=new THREE.Vector3(0,1,0);this.target=new THREE.Object3D;this.intensity=b!==void 0?b:1;this.distance=c!==void 0?c:0;this.onlyShadow=this.castShadow=false;this.shadowCameraNear=50;this.shadowCameraFar=5E3;this.shadowCameraLeft=-500;this.shadowCameraTop=this.shadowCameraRight=500;this.shadowCameraBottom=-500;this.shadowCameraVisible=false;this.shadowBias=0;this.shadowDarkness=0.5;this.shadowMapHeight=this.shadowMapWidth=512;
this.shadowCascade=false;this.shadowCascadeOffset=new THREE.Vector3(0,0,-1E3);this.shadowCascadeCount=2;this.shadowCascadeBias=[0,0,0];this.shadowCascadeWidth=[512,512,512];this.shadowCascadeHeight=[512,512,512];this.shadowCascadeNearZ=[-1,0.99,0.998];this.shadowCascadeFarZ=[0.99,0.998,1];this.shadowCascadeArray=[];this.shadowMatrix=this.shadowCamera=this.shadowMapSize=this.shadowMap=null};THREE.DirectionalLight.prototype=new THREE.Light;THREE.DirectionalLight.prototype.constructor=THREE.DirectionalLight;
THREE.PointLight=function(a,b,c){THREE.Light.call(this,a);this.position=new THREE.Vector3(0,0,0);this.intensity=b!==void 0?b:1;this.distance=c!==void 0?c:0};THREE.PointLight.prototype=new THREE.Light;THREE.PointLight.prototype.constructor=THREE.PointLight;
THREE.SpotLight=function(a,b,c,d,e){THREE.Light.call(this,a);this.position=new THREE.Vector3(0,1,0);this.target=new THREE.Object3D;this.intensity=b!==void 0?b:1;this.distance=c!==void 0?c:0;this.angle=d!==void 0?d:Math.PI/2;this.exponent=e!==void 0?e:10;this.onlyShadow=this.castShadow=false;this.shadowCameraNear=50;this.shadowCameraFar=5E3;this.shadowCameraFov=50;this.shadowCameraVisible=false;this.shadowBias=0;this.shadowDarkness=0.5;this.shadowMapHeight=this.shadowMapWidth=512;this.shadowMatrix=
this.shadowCamera=this.shadowMapSize=this.shadowMap=null};THREE.SpotLight.prototype=new THREE.Light;THREE.SpotLight.prototype.constructor=THREE.SpotLight;THREE.Loader=function(a){this.statusDomElement=(this.showStatus=a)?THREE.Loader.prototype.addStatusElement():null;this.onLoadStart=function(){};this.onLoadProgress=function(){};this.onLoadComplete=function(){}};
THREE.Loader.prototype={constructor:THREE.Loader,crossOrigin:"anonymous",addStatusElement:function(){var a=document.createElement("div");a.style.position="absolute";a.style.right="0px";a.style.top="0px";a.style.fontSize="0.8em";a.style.textAlign="left";a.style.background="rgba(0,0,0,0.25)";a.style.color="#fff";a.style.width="120px";a.style.padding="0.5em 0.5em 0.5em 0.5em";a.style.zIndex=1E3;a.innerHTML="Loading ...";return a},updateProgress:function(a){var b="Loaded ",b=a.total?b+((100*a.loaded/
a.total).toFixed(0)+"%"):b+((a.loaded/1E3).toFixed(2)+" KB");this.statusDomElement.innerHTML=b},extractUrlBase:function(a){a=a.split("/");a.pop();return(a.length<1?".":a.join("/"))+"/"},initMaterials:function(a,b,c){a.materials=[];for(var d=0;d<b.length;++d)a.materials[d]=THREE.Loader.prototype.createMaterial(b[d],c)},hasNormals:function(a){var b,c,d=a.materials.length;for(c=0;c<d;c++){b=a.materials[c];if(b instanceof THREE.ShaderMaterial)return true}return false},createMaterial:function(a,b){function c(a){a=
Math.log(a)/Math.LN2;return Math.floor(a)==a}function d(a){a=Math.log(a)/Math.LN2;return Math.pow(2,Math.round(a))}function e(a,b){var e=new Image;e.onload=function(){if(!c(this.width)||!c(this.height)){var b=d(this.width),e=d(this.height);a.image.width=b;a.image.height=e;a.image.getContext("2d").drawImage(this,0,0,b,e)}else a.image=this;a.needsUpdate=true};e.crossOrigin=h.crossOrigin;e.src=b}function f(a,c,d,f,g,h){var j=document.createElement("canvas");a[c]=new THREE.Texture(j);a[c].sourceFile=
d;if(f){a[c].repeat.set(f[0],f[1]);if(f[0]!=1)a[c].wrapS=THREE.RepeatWrapping;if(f[1]!=1)a[c].wrapT=THREE.RepeatWrapping}g&&a[c].offset.set(g[0],g[1]);if(h){f={repeat:THREE.RepeatWrapping,mirror:THREE.MirroredRepeatWrapping};if(f[h[0]]!==void 0)a[c].wrapS=f[h[0]];if(f[h[1]]!==void 0)a[c].wrapT=f[h[1]]}e(a[c],b+"/"+d)}function g(a){return(a[0]*255<<16)+(a[1]*255<<8)+a[2]*255}var h=this,j="MeshLambertMaterial",k={color:15658734,opacity:1,map:null,lightMap:null,normalMap:null,wireframe:a.wireframe};
if(a.shading){var l=a.shading.toLowerCase();l==="phong"?j="MeshPhongMaterial":l==="basic"&&(j="MeshBasicMaterial")}if(a.blending!==void 0&&THREE[a.blending]!==void 0)k.blending=THREE[a.blending];if(a.transparent!==void 0||a.opacity<1)k.transparent=a.transparent;if(a.depthTest!==void 0)k.depthTest=a.depthTest;if(a.depthWrite!==void 0)k.depthWrite=a.depthWrite;if(a.vertexColors!==void 0)if(a.vertexColors=="face")k.vertexColors=THREE.FaceColors;else if(a.vertexColors)k.vertexColors=THREE.VertexColors;
if(a.colorDiffuse)k.color=g(a.colorDiffuse);else if(a.DbgColor)k.color=a.DbgColor;if(a.colorSpecular)k.specular=g(a.colorSpecular);if(a.colorAmbient)k.ambient=g(a.colorAmbient);if(a.transparency)k.opacity=a.transparency;if(a.specularCoef)k.shininess=a.specularCoef;a.mapDiffuse&&b&&f(k,"map",a.mapDiffuse,a.mapDiffuseRepeat,a.mapDiffuseOffset,a.mapDiffuseWrap);a.mapLight&&b&&f(k,"lightMap",a.mapLight,a.mapLightRepeat,a.mapLightOffset,a.mapLightWrap);a.mapNormal&&b&&f(k,"normalMap",a.mapNormal,a.mapNormalRepeat,
a.mapNormalOffset,a.mapNormalWrap);a.mapSpecular&&b&&f(k,"specularMap",a.mapSpecular,a.mapSpecularRepeat,a.mapSpecularOffset,a.mapSpecularWrap);if(a.mapNormal){j=THREE.ShaderUtils.lib.normal;l=THREE.UniformsUtils.clone(j.uniforms);l.tNormal.texture=k.normalMap;if(a.mapNormalFactor)l.uNormalScale.value=a.mapNormalFactor;if(k.map){l.tDiffuse.texture=k.map;l.enableDiffuse.value=true}if(k.specularMap){l.tSpecular.texture=k.specularMap;l.enableSpecular.value=true}if(k.lightMap){l.tAO.texture=k.lightMap;
l.enableAO.value=true}l.uDiffuseColor.value.setHex(k.color);l.uSpecularColor.value.setHex(k.specular);l.uAmbientColor.value.setHex(k.ambient);l.uShininess.value=k.shininess;if(k.opacity!==void 0)l.uOpacity.value=k.opacity;k=new THREE.ShaderMaterial({fragmentShader:j.fragmentShader,vertexShader:j.vertexShader,uniforms:l,lights:true,fog:true})}else k=new THREE[j](k);if(a.DbgName!==void 0)k.name=a.DbgName;return k}};THREE.BinaryLoader=function(a){THREE.Loader.call(this,a)};
THREE.BinaryLoader.prototype=new THREE.Loader;THREE.BinaryLoader.prototype.constructor=THREE.BinaryLoader;THREE.BinaryLoader.prototype.load=function(a,b,c,d){var c=c?c:this.extractUrlBase(a),d=d?d:this.extractUrlBase(a),e=this.showProgress?THREE.Loader.prototype.updateProgress:null;this.onLoadStart();this.loadAjaxJSON(this,a,b,c,d,e)};
THREE.BinaryLoader.prototype.loadAjaxJSON=function(a,b,c,d,e,f){var g=new XMLHttpRequest;g.onreadystatechange=function(){if(g.readyState==4)if(g.status==200||g.status==0){var h=JSON.parse(g.responseText);a.loadAjaxBuffers(h,c,e,d,f)}else console.error("THREE.BinaryLoader: Couldn't load ["+b+"] ["+g.status+"]")};g.open("GET",b,true);g.overrideMimeType&&g.overrideMimeType("text/plain; charset=x-user-defined");g.setRequestHeader("Content-Type","text/plain");g.send(null)};
THREE.BinaryLoader.prototype.loadAjaxBuffers=function(a,b,c,d,e){var f=new XMLHttpRequest,g=c+"/"+a.buffers,h=0;f.onreadystatechange=function(){if(f.readyState==4)f.status==200||f.status==0?THREE.BinaryLoader.prototype.createBinModel(f.response,b,d,a.materials):console.error("THREE.BinaryLoader: Couldn't load ["+g+"] ["+f.status+"]");else if(f.readyState==3){if(e){h==0&&(h=f.getResponseHeader("Content-Length"));e({total:h,loaded:f.responseText.length})}}else f.readyState==2&&(h=f.getResponseHeader("Content-Length"))};
f.open("GET",g,true);f.responseType="arraybuffer";f.send(null)};
THREE.BinaryLoader.prototype.createBinModel=function(a,b,c,d){var e=function(b){var c,e,j,k,l,o,m,p,r,n,q,u,t,y,s;function x(a){return a%4?4-a%4:0}function E(a,b){return(new Uint8Array(a,b,1))[0]}function D(a,b){return(new Uint32Array(a,b,1))[0]}function A(b,c){var d,e,f,g,h,i,j,k,l=new Uint32Array(a,c,3*b);for(d=0;d<b;d++){e=l[d*3];f=l[d*3+1];g=l[d*3+2];h=Q[e*2];e=Q[e*2+1];i=Q[f*2];j=Q[f*2+1];f=Q[g*2];k=Q[g*2+1];g=Z.faceVertexUvs[0];var m=[];m.push(new THREE.UV(h,e));m.push(new THREE.UV(i,j));m.push(new THREE.UV(f,
k));g.push(m)}}function v(b,c){var d,e,f,g,h,i,j,k,l,m,n=new Uint32Array(a,c,4*b);for(d=0;d<b;d++){e=n[d*4];f=n[d*4+1];g=n[d*4+2];h=n[d*4+3];i=Q[e*2];e=Q[e*2+1];j=Q[f*2];l=Q[f*2+1];k=Q[g*2];m=Q[g*2+1];g=Q[h*2];f=Q[h*2+1];h=Z.faceVertexUvs[0];var o=[];o.push(new THREE.UV(i,e));o.push(new THREE.UV(j,l));o.push(new THREE.UV(k,m));o.push(new THREE.UV(g,f));h.push(o)}}function H(b,c,d){for(var e,f,g,h,c=new Uint32Array(a,c,3*b),i=new Uint16Array(a,d,b),d=0;d<b;d++){e=c[d*3];f=c[d*3+1];g=c[d*3+2];h=i[d];
Z.faces.push(new THREE.Face3(e,f,g,null,null,h))}}function I(b,c,d){for(var e,f,g,h,i,c=new Uint32Array(a,c,4*b),j=new Uint16Array(a,d,b),d=0;d<b;d++){e=c[d*4];f=c[d*4+1];g=c[d*4+2];h=c[d*4+3];i=j[d];Z.faces.push(new THREE.Face4(e,f,g,h,null,null,i))}}function M(b,c,d,e){for(var f,g,h,i,j,k,l,c=new Uint32Array(a,c,3*b),d=new Uint32Array(a,d,3*b),m=new Uint16Array(a,e,b),e=0;e<b;e++){f=c[e*3];g=c[e*3+1];h=c[e*3+2];j=d[e*3];k=d[e*3+1];l=d[e*3+2];i=m[e];var n=G[k*3],o=G[k*3+1];k=G[k*3+2];var p=G[l*3],
r=G[l*3+1];l=G[l*3+2];Z.faces.push(new THREE.Face3(f,g,h,[new THREE.Vector3(G[j*3],G[j*3+1],G[j*3+2]),new THREE.Vector3(n,o,k),new THREE.Vector3(p,r,l)],null,i))}}function R(b,c,d,e){for(var f,g,h,i,j,k,l,m,n,c=new Uint32Array(a,c,4*b),d=new Uint32Array(a,d,4*b),o=new Uint16Array(a,e,b),e=0;e<b;e++){f=c[e*4];g=c[e*4+1];h=c[e*4+2];i=c[e*4+3];k=d[e*4];l=d[e*4+1];m=d[e*4+2];n=d[e*4+3];j=o[e];var p=G[l*3],r=G[l*3+1];l=G[l*3+2];var q=G[m*3],s=G[m*3+1];m=G[m*3+2];var t=G[n*3],v=G[n*3+1];n=G[n*3+2];Z.faces.push(new THREE.Face4(f,
g,h,i,[new THREE.Vector3(G[k*3],G[k*3+1],G[k*3+2]),new THREE.Vector3(p,r,l),new THREE.Vector3(q,s,m),new THREE.Vector3(t,v,n)],null,j))}}var Z=this,B=0,G=[],Q=[],C,i,P;THREE.Geometry.call(this);THREE.Loader.prototype.initMaterials(Z,d,b);(function(a,b,c){for(var a=new Uint8Array(a,b,c),d="",e=0;e<c;e++)d=d+String.fromCharCode(a[b+e]);return d})(a,B,12);c=E(a,B+12);E(a,B+13);E(a,B+14);E(a,B+15);e=E(a,B+16);j=E(a,B+17);k=E(a,B+18);l=E(a,B+19);o=D(a,B+20);m=D(a,B+20+4);p=D(a,B+20+8);b=D(a,B+20+12);r=
D(a,B+20+16);n=D(a,B+20+20);q=D(a,B+20+24);u=D(a,B+20+28);t=D(a,B+20+32);y=D(a,B+20+36);s=D(a,B+20+40);B=B+c;c=e*3+l;P=e*4+l;C=b*c;i=r*(c+j*3);e=n*(c+k*3);l=q*(c+j*3+k*3);c=u*P;j=t*(P+j*4);k=y*(P+k*4);B=B+function(b){var b=new Float32Array(a,b,o*3),c,d,e,f;for(c=0;c<o;c++){d=b[c*3];e=b[c*3+1];f=b[c*3+2];Z.vertices.push(new THREE.Vector3(d,e,f))}return o*3*Float32Array.BYTES_PER_ELEMENT}(B);B=B+function(b){if(m){var b=new Int8Array(a,b,m*3),c,d,e,f;for(c=0;c<m;c++){d=b[c*3];e=b[c*3+1];f=b[c*3+2];G.push(d/
127,e/127,f/127)}}return m*3*Int8Array.BYTES_PER_ELEMENT}(B);B=B+x(m*3);B=B+function(b){if(p){var b=new Float32Array(a,b,p*2),c,d,e;for(c=0;c<p;c++){d=b[c*2];e=b[c*2+1];Q.push(d,e)}}return p*2*Float32Array.BYTES_PER_ELEMENT}(B);C=B+C+x(b*2);i=C+i+x(r*2);e=i+e+x(n*2);l=e+l+x(q*2);c=l+c+x(u*2);j=c+j+x(t*2);k=j+k+x(y*2);(function(a){if(n){var b=a+n*Uint32Array.BYTES_PER_ELEMENT*3;H(n,a,b+n*Uint32Array.BYTES_PER_ELEMENT*3);A(n,b)}})(i);(function(a){if(q){var b=a+q*Uint32Array.BYTES_PER_ELEMENT*3,c=b+
q*Uint32Array.BYTES_PER_ELEMENT*3;M(q,a,b,c+q*Uint32Array.BYTES_PER_ELEMENT*3);A(q,c)}})(e);(function(a){if(y){var b=a+y*Uint32Array.BYTES_PER_ELEMENT*4;I(y,a,b+y*Uint32Array.BYTES_PER_ELEMENT*4);v(y,b)}})(j);(function(a){if(s){var b=a+s*Uint32Array.BYTES_PER_ELEMENT*4,c=b+s*Uint32Array.BYTES_PER_ELEMENT*4;R(s,a,b,c+s*Uint32Array.BYTES_PER_ELEMENT*4);v(s,c)}})(k);b&&H(b,B,B+b*Uint32Array.BYTES_PER_ELEMENT*3);(function(a){if(r){var b=a+r*Uint32Array.BYTES_PER_ELEMENT*3;M(r,a,b,b+r*Uint32Array.BYTES_PER_ELEMENT*
3)}})(C);u&&I(u,l,l+u*Uint32Array.BYTES_PER_ELEMENT*4);(function(a){if(t){var b=a+t*Uint32Array.BYTES_PER_ELEMENT*4;R(t,a,b,b+t*Uint32Array.BYTES_PER_ELEMENT*4)}})(c);this.computeCentroids();this.computeFaceNormals();THREE.Loader.prototype.hasNormals(this)&&this.computeTangents()};e.prototype=new THREE.Geometry;e.prototype.constructor=e;b(new e(c))};THREE.ImageLoader=function(){THREE.EventTarget.call(this)};
THREE.ImageLoader.prototype={constructor:THREE.ImageLoader,crossOrigin:null,load:function(a){var b=this,c=new Image;c.addEventListener("load",function(){b.dispatchEvent({type:"load",content:c})},false);c.addEventListener("error",function(){b.dispatchEvent({type:"error",message:"Couldn't load URL ["+a+"]"})},false);if(b.crossOrigin)c.crossOrigin=b.crossOrigin;c.src=a}};THREE.JSONLoader=function(a){THREE.Loader.call(this,a)};THREE.JSONLoader.prototype=new THREE.Loader;
THREE.JSONLoader.prototype.constructor=THREE.JSONLoader;THREE.JSONLoader.prototype.load=function(a,b,c){c=c?c:this.extractUrlBase(a);this.onLoadStart();this.loadAjaxJSON(this,a,b,c)};
THREE.JSONLoader.prototype.loadAjaxJSON=function(a,b,c,d,e){var f=new XMLHttpRequest,g=0;f.onreadystatechange=function(){if(f.readyState===f.DONE)if(f.status===200||f.status===0){if(f.responseText){var h=JSON.parse(f.responseText);a.createModel(h,c,d)}else console.warn("THREE.JSONLoader: ["+b+"] seems to be unreachable or file there is empty");a.onLoadComplete()}else console.error("THREE.JSONLoader: Couldn't load ["+b+"] ["+f.status+"]");else if(f.readyState===f.LOADING){if(e){g===0&&(g=f.getResponseHeader("Content-Length"));
e({total:g,loaded:f.responseText.length})}}else f.readyState===f.HEADERS_RECEIVED&&(g=f.getResponseHeader("Content-Length"))};f.open("GET",b,true);f.overrideMimeType&&f.overrideMimeType("text/plain; charset=x-user-defined");f.setRequestHeader("Content-Type","text/plain");f.send(null)};
THREE.JSONLoader.prototype.createModel=function(a,b,c){var d=new THREE.Geometry,e=a.scale!==void 0?1/a.scale:1;this.initMaterials(d,a.materials,c);(function(b){var c,e,j,k,l,o,m,p,r,n,q,u,t,y,s=a.faces;o=a.vertices;var x=a.normals,E=a.colors,D=0;for(c=0;c<a.uvs.length;c++)a.uvs[c].length&&D++;for(c=0;c<D;c++){d.faceUvs[c]=[];d.faceVertexUvs[c]=[]}k=0;for(l=o.length;k<l;){m=new THREE.Vector3;m.x=o[k++]*b;m.y=o[k++]*b;m.z=o[k++]*b;d.vertices.push(m)}k=0;for(l=s.length;k<l;){b=s[k++];o=b&1;j=b&2;c=b&
4;e=b&8;p=b&16;m=b&32;n=b&64;b=b&128;if(o){q=new THREE.Face4;q.a=s[k++];q.b=s[k++];q.c=s[k++];q.d=s[k++];o=4}else{q=new THREE.Face3;q.a=s[k++];q.b=s[k++];q.c=s[k++];o=3}if(j){j=s[k++];q.materialIndex=j}j=d.faces.length;if(c)for(c=0;c<D;c++){u=a.uvs[c];r=s[k++];y=u[r*2];r=u[r*2+1];d.faceUvs[c][j]=new THREE.UV(y,r)}if(e)for(c=0;c<D;c++){u=a.uvs[c];t=[];for(e=0;e<o;e++){r=s[k++];y=u[r*2];r=u[r*2+1];t[e]=new THREE.UV(y,r)}d.faceVertexUvs[c][j]=t}if(p){p=s[k++]*3;e=new THREE.Vector3;e.x=x[p++];e.y=x[p++];
e.z=x[p];q.normal=e}if(m)for(c=0;c<o;c++){p=s[k++]*3;e=new THREE.Vector3;e.x=x[p++];e.y=x[p++];e.z=x[p];q.vertexNormals.push(e)}if(n){m=s[k++];m=new THREE.Color(E[m]);q.color=m}if(b)for(c=0;c<o;c++){m=s[k++];m=new THREE.Color(E[m]);q.vertexColors.push(m)}d.faces.push(q)}})(e);(function(){var b,c,e,j;if(a.skinWeights){b=0;for(c=a.skinWeights.length;b<c;b=b+2){e=a.skinWeights[b];j=a.skinWeights[b+1];d.skinWeights.push(new THREE.Vector4(e,j,0,0))}}if(a.skinIndices){b=0;for(c=a.skinIndices.length;b<c;b=
b+2){e=a.skinIndices[b];j=a.skinIndices[b+1];d.skinIndices.push(new THREE.Vector4(e,j,0,0))}}d.bones=a.bones;d.animation=a.animation})();(function(b){if(a.morphTargets!==void 0){var c,e,j,k,l,o;c=0;for(e=a.morphTargets.length;c<e;c++){d.morphTargets[c]={};d.morphTargets[c].name=a.morphTargets[c].name;d.morphTargets[c].vertices=[];l=d.morphTargets[c].vertices;o=a.morphTargets[c].vertices;j=0;for(k=o.length;j<k;j=j+3){var m=new THREE.Vector3;m.x=o[j]*b;m.y=o[j+1]*b;m.z=o[j+2]*b;l.push(m)}}}if(a.morphColors!==
void 0){c=0;for(e=a.morphColors.length;c<e;c++){d.morphColors[c]={};d.morphColors[c].name=a.morphColors[c].name;d.morphColors[c].colors=[];k=d.morphColors[c].colors;l=a.morphColors[c].colors;b=0;for(j=l.length;b<j;b=b+3){o=new THREE.Color(16755200);o.setRGB(l[b],l[b+1],l[b+2]);k.push(o)}}}})(e);d.computeCentroids();d.computeFaceNormals();this.hasNormals(d)&&d.computeTangents();b(d)};
THREE.SceneLoader=function(){this.onLoadStart=function(){};this.onLoadProgress=function(){};this.onLoadComplete=function(){};this.callbackSync=function(){};this.callbackProgress=function(){}};THREE.SceneLoader.prototype.constructor=THREE.SceneLoader;
THREE.SceneLoader.prototype.load=function(a,b){var c=this,d=new XMLHttpRequest;d.onreadystatechange=function(){if(d.readyState==4)if(d.status==200||d.status==0){var e=JSON.parse(d.responseText);c.createScene(e,b,a)}else console.error("THREE.SceneLoader: Couldn't load ["+a+"] ["+d.status+"]")};d.open("GET",a,true);d.overrideMimeType&&d.overrideMimeType("text/plain; charset=x-user-defined");d.setRequestHeader("Content-Type","text/plain");d.send(null)};
THREE.SceneLoader.prototype.createScene=function(a,b,c){function d(a,b){return b=="relativeToHTML"?a:k+"/"+a}function e(){var a;for(m in B.objects)if(!L.objects[m]){u=B.objects[m];if(u.geometry!==void 0){if(I=L.geometries[u.geometry]){a=false;M=L.materials[u.materials[0]];(a=M instanceof THREE.ShaderMaterial)&&I.computeTangents();x=u.position;E=u.rotation;D=u.quaternion;A=u.scale;t=u.matrix;D=0;u.materials.length==0&&(M=new THREE.MeshFaceMaterial);u.materials.length>1&&(M=new THREE.MeshFaceMaterial);
a=new THREE.Mesh(I,M);a.name=m;if(t){a.matrixAutoUpdate=false;a.matrix.set(t[0],t[1],t[2],t[3],t[4],t[5],t[6],t[7],t[8],t[9],t[10],t[11],t[12],t[13],t[14],t[15])}else{a.position.set(x[0],x[1],x[2]);if(D){a.quaternion.set(D[0],D[1],D[2],D[3]);a.useQuaternion=true}else a.rotation.set(E[0],E[1],E[2]);a.scale.set(A[0],A[1],A[2])}a.visible=u.visible;a.doubleSided=u.doubleSided;a.castShadow=u.castShadow;a.receiveShadow=u.receiveShadow;L.scene.add(a);L.objects[m]=a}}else{x=u.position;E=u.rotation;D=u.quaternion;
A=u.scale;D=0;a=new THREE.Object3D;a.name=m;a.position.set(x[0],x[1],x[2]);if(D){a.quaternion.set(D[0],D[1],D[2],D[3]);a.useQuaternion=true}else a.rotation.set(E[0],E[1],E[2]);a.scale.set(A[0],A[1],A[2]);a.visible=u.visible!==void 0?u.visible:false;L.scene.add(a);L.objects[m]=a;L.empties[m]=a}}}function f(a){return function(b){L.geometries[a]=b;e();Q=Q-1;j.onLoadComplete();h()}}function g(a){return function(b){L.geometries[a]=b}}function h(){j.callbackProgress({totalModels:i,totalTextures:P,loadedModels:i-
Q,loadedTextures:P-C},L);j.onLoadProgress();Q==0&&C==0&&b(L)}var j=this,k=THREE.Loader.prototype.extractUrlBase(c),l,o,m,p,r,n,q,u,t,y,s,x,E,D,A,v,H,I,M,R,Z,B,G,Q,C,i,P,L;B=a;c=new THREE.BinaryLoader;G=new THREE.JSONLoader;C=Q=0;L={scene:new THREE.Scene,geometries:{},materials:{},textures:{},objects:{},cameras:{},lights:{},fogs:{},empties:{}};if(B.transform){a=B.transform.position;y=B.transform.rotation;v=B.transform.scale;a&&L.scene.position.set(a[0],a[1],a[2]);y&&L.scene.rotation.set(y[0],y[1],
y[2]);v&&L.scene.scale.set(v[0],v[1],v[2]);if(a||y||v){L.scene.updateMatrix();L.scene.updateMatrixWorld()}}a=function(){C=C-1;h();j.onLoadComplete()};for(r in B.cameras){v=B.cameras[r];v.type=="perspective"?R=new THREE.PerspectiveCamera(v.fov,v.aspect,v.near,v.far):v.type=="ortho"&&(R=new THREE.OrthographicCamera(v.left,v.right,v.top,v.bottom,v.near,v.far));x=v.position;y=v.target;v=v.up;R.position.set(x[0],x[1],x[2]);R.target=new THREE.Vector3(y[0],y[1],y[2]);v&&R.up.set(v[0],v[1],v[2]);L.cameras[r]=
R}for(p in B.lights){y=B.lights[p];r=y.color!==void 0?y.color:16777215;R=y.intensity!==void 0?y.intensity:1;if(y.type=="directional"){x=y.direction;s=new THREE.DirectionalLight(r,R);s.position.set(x[0],x[1],x[2]);s.position.normalize()}else if(y.type=="point"){x=y.position;s=y.distance;s=new THREE.PointLight(r,R,s);s.position.set(x[0],x[1],x[2])}else y.type=="ambient"&&(s=new THREE.AmbientLight(r));L.scene.add(s);L.lights[p]=s}for(n in B.fogs){p=B.fogs[n];p.type=="linear"?Z=new THREE.Fog(0,p.near,
p.far):p.type=="exp2"&&(Z=new THREE.FogExp2(0,p.density));v=p.color;Z.color.setRGB(v[0],v[1],v[2]);L.fogs[n]=Z}if(L.cameras&&B.defaults.camera)L.currentCamera=L.cameras[B.defaults.camera];if(L.fogs&&B.defaults.fog)L.scene.fog=L.fogs[B.defaults.fog];v=B.defaults.bgcolor;L.bgColor=new THREE.Color;L.bgColor.setRGB(v[0],v[1],v[2]);L.bgColorAlpha=B.defaults.bgalpha;for(l in B.geometries){n=B.geometries[l];if(n.type=="bin_mesh"||n.type=="ascii_mesh"){Q=Q+1;j.onLoadStart()}}i=Q;for(l in B.geometries){n=
B.geometries[l];if(n.type=="cube"){I=new THREE.CubeGeometry(n.width,n.height,n.depth,n.segmentsWidth,n.segmentsHeight,n.segmentsDepth,null,n.flipped,n.sides);L.geometries[l]=I}else if(n.type=="plane"){I=new THREE.PlaneGeometry(n.width,n.height,n.segmentsWidth,n.segmentsHeight);L.geometries[l]=I}else if(n.type=="sphere"){I=new THREE.SphereGeometry(n.radius,n.segmentsWidth,n.segmentsHeight);L.geometries[l]=I}else if(n.type=="cylinder"){I=new THREE.CylinderGeometry(n.topRad,n.botRad,n.height,n.radSegs,
n.heightSegs);L.geometries[l]=I}else if(n.type=="torus"){I=new THREE.TorusGeometry(n.radius,n.tube,n.segmentsR,n.segmentsT);L.geometries[l]=I}else if(n.type=="icosahedron"){I=new THREE.IcosahedronGeometry(n.radius,n.subdivisions);L.geometries[l]=I}else if(n.type=="bin_mesh")c.load(d(n.url,B.urlBaseType),f(l));else if(n.type=="ascii_mesh")G.load(d(n.url,B.urlBaseType),f(l));else if(n.type=="embedded_mesh"){n=B.embeds[n.id];n.metadata=B.metadata;n&&G.createModel(n,g(l),"")}}for(q in B.textures){l=B.textures[q];
if(l.url instanceof Array){C=C+l.url.length;for(n=0;n<l.url.length;n++)j.onLoadStart()}else{C=C+1;j.onLoadStart()}}P=C;for(q in B.textures){l=B.textures[q];if(l.mapping!=void 0&&THREE[l.mapping]!=void 0)l.mapping=new THREE[l.mapping];if(l.url instanceof Array){n=[];for(Z=0;Z<l.url.length;Z++)n[Z]=d(l.url[Z],B.urlBaseType);n=THREE.ImageUtils.loadTextureCube(n,l.mapping,a)}else{n=THREE.ImageUtils.loadTexture(d(l.url,B.urlBaseType),l.mapping,a);if(THREE[l.minFilter]!=void 0)n.minFilter=THREE[l.minFilter];
if(THREE[l.magFilter]!=void 0)n.magFilter=THREE[l.magFilter];if(l.repeat){n.repeat.set(l.repeat[0],l.repeat[1]);if(l.repeat[0]!=1)n.wrapS=THREE.RepeatWrapping;if(l.repeat[1]!=1)n.wrapT=THREE.RepeatWrapping}l.offset&&n.offset.set(l.offset[0],l.offset[1]);if(l.wrap){Z={repeat:THREE.RepeatWrapping,mirror:THREE.MirroredRepeatWrapping};if(Z[l.wrap[0]]!==void 0)n.wrapS=Z[l.wrap[0]];if(Z[l.wrap[1]]!==void 0)n.wrapT=Z[l.wrap[1]]}}L.textures[q]=n}for(o in B.materials){t=B.materials[o];for(H in t.parameters)if(H==
"envMap"||H=="map"||H=="lightMap")t.parameters[H]=L.textures[t.parameters[H]];else if(H=="shading")t.parameters[H]=t.parameters[H]=="flat"?THREE.FlatShading:THREE.SmoothShading;else if(H=="blending")t.parameters[H]=THREE[t.parameters[H]]?THREE[t.parameters[H]]:THREE.NormalBlending;else if(H=="combine")t.parameters[H]=t.parameters[H]=="MixOperation"?THREE.MixOperation:THREE.MultiplyOperation;else if(H=="vertexColors")if(t.parameters[H]=="face")t.parameters[H]=THREE.FaceColors;else if(t.parameters[H])t.parameters[H]=
THREE.VertexColors;if(t.parameters.opacity!==void 0&&t.parameters.opacity<1)t.parameters.transparent=true;if(t.parameters.normalMap){q=THREE.ShaderUtils.lib.normal;a=THREE.UniformsUtils.clone(q.uniforms);l=t.parameters.color;n=t.parameters.specular;Z=t.parameters.ambient;c=t.parameters.shininess;a.tNormal.texture=L.textures[t.parameters.normalMap];if(t.parameters.normalMapFactor)a.uNormalScale.value=t.parameters.normalMapFactor;if(t.parameters.map){a.tDiffuse.texture=t.parameters.map;a.enableDiffuse.value=
true}if(t.parameters.lightMap){a.tAO.texture=t.parameters.lightMap;a.enableAO.value=true}if(t.parameters.specularMap){a.tSpecular.texture=L.textures[t.parameters.specularMap];a.enableSpecular.value=true}a.uDiffuseColor.value.setHex(l);a.uSpecularColor.value.setHex(n);a.uAmbientColor.value.setHex(Z);a.uShininess.value=c;if(t.parameters.opacity)a.uOpacity.value=t.parameters.opacity;M=new THREE.ShaderMaterial({fragmentShader:q.fragmentShader,vertexShader:q.vertexShader,uniforms:a,lights:true,fog:true})}else M=
new THREE[t.type](t.parameters);L.materials[o]=M}e();j.callbackSync(L);h()};
THREE.Material=function(a){a=a||{};this.id=THREE.MaterialCount++;this.name="";this.opacity=a.opacity!==void 0?a.opacity:1;this.transparent=a.transparent!==void 0?a.transparent:false;this.blending=a.blending!==void 0?a.blending:THREE.NormalBlending;this.blendSrc=a.blendSrc!==void 0?a.blendSrc:THREE.SrcAlphaFactor;this.blendDst=a.blendDst!==void 0?a.blendDst:THREE.OneMinusSrcAlphaFactor;this.blendEquation=a.blendEquation!==void 0?a.blendEquation:THREE.AddEquation;this.depthTest=a.depthTest!==void 0?
a.depthTest:true;this.depthWrite=a.depthWrite!==void 0?a.depthWrite:true;this.polygonOffset=a.polygonOffset!==void 0?a.polygonOffset:false;this.polygonOffsetFactor=a.polygonOffsetFactor!==void 0?a.polygonOffsetFactor:0;this.polygonOffsetUnits=a.polygonOffsetUnits!==void 0?a.polygonOffsetUnits:0;this.alphaTest=a.alphaTest!==void 0?a.alphaTest:0;this.overdraw=a.overdraw!==void 0?a.overdraw:false;this.needsUpdate=this.visible=true};THREE.MaterialCount=0;THREE.NoShading=0;THREE.FlatShading=1;
THREE.SmoothShading=2;THREE.NoColors=0;THREE.FaceColors=1;THREE.VertexColors=2;THREE.NoBlending=0;THREE.NormalBlending=1;THREE.AdditiveBlending=2;THREE.SubtractiveBlending=3;THREE.MultiplyBlending=4;THREE.AdditiveAlphaBlending=5;THREE.CustomBlending=6;THREE.AddEquation=100;THREE.SubtractEquation=101;THREE.ReverseSubtractEquation=102;THREE.ZeroFactor=200;THREE.OneFactor=201;THREE.SrcColorFactor=202;THREE.OneMinusSrcColorFactor=203;THREE.SrcAlphaFactor=204;THREE.OneMinusSrcAlphaFactor=205;
THREE.DstAlphaFactor=206;THREE.OneMinusDstAlphaFactor=207;THREE.DstColorFactor=208;THREE.OneMinusDstColorFactor=209;THREE.SrcAlphaSaturateFactor=210;
THREE.LineBasicMaterial=function(a){THREE.Material.call(this,a);a=a||{};this.color=a.color!==void 0?new THREE.Color(a.color):new THREE.Color(16777215);this.linewidth=a.linewidth!==void 0?a.linewidth:1;this.linecap=a.linecap!==void 0?a.linecap:"round";this.linejoin=a.linejoin!==void 0?a.linejoin:"round";this.vertexColors=a.vertexColors?a.vertexColors:false;this.fog=a.fog!==void 0?a.fog:true};THREE.LineBasicMaterial.prototype=new THREE.Material;THREE.LineBasicMaterial.prototype.constructor=THREE.LineBasicMaterial;
THREE.MeshBasicMaterial=function(a){THREE.Material.call(this,a);a=a||{};this.color=a.color!==void 0?new THREE.Color(a.color):new THREE.Color(16777215);this.map=a.map!==void 0?a.map:null;this.lightMap=a.lightMap!==void 0?a.lightMap:null;this.envMap=a.envMap!==void 0?a.envMap:null;this.combine=a.combine!==void 0?a.combine:THREE.MultiplyOperation;this.reflectivity=a.reflectivity!==void 0?a.reflectivity:1;this.refractionRatio=a.refractionRatio!==void 0?a.refractionRatio:0.98;this.fog=a.fog!==void 0?a.fog:
true;this.shading=a.shading!==void 0?a.shading:THREE.SmoothShading;this.wireframe=a.wireframe!==void 0?a.wireframe:false;this.wireframeLinewidth=a.wireframeLinewidth!==void 0?a.wireframeLinewidth:1;this.wireframeLinecap=a.wireframeLinecap!==void 0?a.wireframeLinecap:"round";this.wireframeLinejoin=a.wireframeLinejoin!==void 0?a.wireframeLinejoin:"round";this.vertexColors=a.vertexColors!==void 0?a.vertexColors:THREE.NoColors;this.skinning=a.skinning!==void 0?a.skinning:false;this.morphTargets=a.morphTargets!==
void 0?a.morphTargets:false};THREE.MeshBasicMaterial.prototype=new THREE.Material;THREE.MeshBasicMaterial.prototype.constructor=THREE.MeshBasicMaterial;
THREE.MeshLambertMaterial=function(a){THREE.Material.call(this,a);a=a||{};this.color=a.color!==void 0?new THREE.Color(a.color):new THREE.Color(16777215);this.ambient=a.ambient!==void 0?new THREE.Color(a.ambient):new THREE.Color(16777215);this.emissive=a.emissive!==void 0?new THREE.Color(a.emissive):new THREE.Color(0);this.wrapAround=a.wrapAround!==void 0?a.wrapAround:false;this.wrapRGB=new THREE.Vector3(1,1,1);this.map=a.map!==void 0?a.map:null;this.lightMap=a.lightMap!==void 0?a.lightMap:null;this.envMap=
a.envMap!==void 0?a.envMap:null;this.combine=a.combine!==void 0?a.combine:THREE.MultiplyOperation;this.reflectivity=a.reflectivity!==void 0?a.reflectivity:1;this.refractionRatio=a.refractionRatio!==void 0?a.refractionRatio:0.98;this.fog=a.fog!==void 0?a.fog:true;this.shading=a.shading!==void 0?a.shading:THREE.SmoothShading;this.wireframe=a.wireframe!==void 0?a.wireframe:false;this.wireframeLinewidth=a.wireframeLinewidth!==void 0?a.wireframeLinewidth:1;this.wireframeLinecap=a.wireframeLinecap!==void 0?
a.wireframeLinecap:"round";this.wireframeLinejoin=a.wireframeLinejoin!==void 0?a.wireframeLinejoin:"round";this.vertexColors=a.vertexColors!==void 0?a.vertexColors:THREE.NoColors;this.skinning=a.skinning!==void 0?a.skinning:false;this.morphTargets=a.morphTargets!==void 0?a.morphTargets:false;this.morphNormals=a.morphNormals!==void 0?a.morphNormals:false};THREE.MeshLambertMaterial.prototype=new THREE.Material;THREE.MeshLambertMaterial.prototype.constructor=THREE.MeshLambertMaterial;
THREE.MeshPhongMaterial=function(a){THREE.Material.call(this,a);a=a||{};this.color=a.color!==void 0?new THREE.Color(a.color):new THREE.Color(16777215);this.ambient=a.ambient!==void 0?new THREE.Color(a.ambient):new THREE.Color(16777215);this.emissive=a.emissive!==void 0?new THREE.Color(a.emissive):new THREE.Color(0);this.specular=a.specular!==void 0?new THREE.Color(a.specular):new THREE.Color(1118481);this.shininess=a.shininess!==void 0?a.shininess:30;this.metal=a.metal!==void 0?a.metal:false;this.perPixel=
a.perPixel!==void 0?a.perPixel:false;this.wrapAround=a.wrapAround!==void 0?a.wrapAround:false;this.wrapRGB=new THREE.Vector3(1,1,1);this.map=a.map!==void 0?a.map:null;this.lightMap=a.lightMap!==void 0?a.lightMap:null;this.envMap=a.envMap!==void 0?a.envMap:null;this.combine=a.combine!==void 0?a.combine:THREE.MultiplyOperation;this.reflectivity=a.reflectivity!==void 0?a.reflectivity:1;this.refractionRatio=a.refractionRatio!==void 0?a.refractionRatio:0.98;this.fog=a.fog!==void 0?a.fog:true;this.shading=
a.shading!==void 0?a.shading:THREE.SmoothShading;this.wireframe=a.wireframe!==void 0?a.wireframe:false;this.wireframeLinewidth=a.wireframeLinewidth!==void 0?a.wireframeLinewidth:1;this.wireframeLinecap=a.wireframeLinecap!==void 0?a.wireframeLinecap:"round";this.wireframeLinejoin=a.wireframeLinejoin!==void 0?a.wireframeLinejoin:"round";this.vertexColors=a.vertexColors!==void 0?a.vertexColors:THREE.NoColors;this.skinning=a.skinning!==void 0?a.skinning:false;this.morphTargets=a.morphTargets!==void 0?
a.morphTargets:false;this.morphNormals=a.morphNormals!==void 0?a.morphNormals:false};THREE.MeshPhongMaterial.prototype=new THREE.Material;THREE.MeshPhongMaterial.prototype.constructor=THREE.MeshPhongMaterial;THREE.MeshDepthMaterial=function(a){THREE.Material.call(this,a);a=a||{};this.shading=a.shading!==void 0?a.shading:THREE.SmoothShading;this.wireframe=a.wireframe!==void 0?a.wireframe:false;this.wireframeLinewidth=a.wireframeLinewidth!==void 0?a.wireframeLinewidth:1};
THREE.MeshDepthMaterial.prototype=new THREE.Material;THREE.MeshDepthMaterial.prototype.constructor=THREE.MeshDepthMaterial;THREE.MeshNormalMaterial=function(a){THREE.Material.call(this,a);a=a||{};this.shading=a.shading?a.shading:THREE.FlatShading;this.wireframe=a.wireframe?a.wireframe:false;this.wireframeLinewidth=a.wireframeLinewidth?a.wireframeLinewidth:1};THREE.MeshNormalMaterial.prototype=new THREE.Material;THREE.MeshNormalMaterial.prototype.constructor=THREE.MeshNormalMaterial;
THREE.MeshFaceMaterial=function(){};THREE.ParticleBasicMaterial=function(a){THREE.Material.call(this,a);a=a||{};this.color=a.color!==void 0?new THREE.Color(a.color):new THREE.Color(16777215);this.map=a.map!==void 0?a.map:null;this.size=a.size!==void 0?a.size:1;this.sizeAttenuation=a.sizeAttenuation!==void 0?a.sizeAttenuation:true;this.vertexColors=a.vertexColors!==void 0?a.vertexColors:false;this.fog=a.fog!==void 0?a.fog:true};THREE.ParticleBasicMaterial.prototype=new THREE.Material;
THREE.ParticleBasicMaterial.prototype.constructor=THREE.ParticleBasicMaterial;THREE.ParticleCanvasMaterial=function(a){THREE.Material.call(this,a);a=a||{};this.color=a.color!==void 0?new THREE.Color(a.color):new THREE.Color(16777215);this.program=a.program!==void 0?a.program:function(){}};THREE.ParticleCanvasMaterial.prototype=new THREE.Material;THREE.ParticleCanvasMaterial.prototype.constructor=THREE.ParticleCanvasMaterial;
THREE.ParticleDOMMaterial=function(a){THREE.Material.call(this);this.domElement=a};
THREE.ShaderMaterial=function(a){THREE.Material.call(this,a);a=a||{};this.fragmentShader=a.fragmentShader!==void 0?a.fragmentShader:"void main() {}";this.vertexShader=a.vertexShader!==void 0?a.vertexShader:"void main() {}";this.uniforms=a.uniforms!==void 0?a.uniforms:{};this.attributes=a.attributes;this.shading=a.shading!==void 0?a.shading:THREE.SmoothShading;this.wireframe=a.wireframe!==void 0?a.wireframe:false;this.wireframeLinewidth=a.wireframeLinewidth!==void 0?a.wireframeLinewidth:1;this.fog=
a.fog!==void 0?a.fog:false;this.lights=a.lights!==void 0?a.lights:false;this.vertexColors=a.vertexColors!==void 0?a.vertexColors:THREE.NoColors;this.skinning=a.skinning!==void 0?a.skinning:false;this.morphTargets=a.morphTargets!==void 0?a.morphTargets:false;this.morphNormals=a.morphNormals!==void 0?a.morphNormals:false};THREE.ShaderMaterial.prototype=new THREE.Material;THREE.ShaderMaterial.prototype.constructor=THREE.ShaderMaterial;
THREE.Texture=function(a,b,c,d,e,f,g,h){this.id=THREE.TextureCount++;this.image=a;this.mapping=b!==void 0?b:new THREE.UVMapping;this.wrapS=c!==void 0?c:THREE.ClampToEdgeWrapping;this.wrapT=d!==void 0?d:THREE.ClampToEdgeWrapping;this.magFilter=e!==void 0?e:THREE.LinearFilter;this.minFilter=f!==void 0?f:THREE.LinearMipMapLinearFilter;this.format=g!==void 0?g:THREE.RGBAFormat;this.type=h!==void 0?h:THREE.UnsignedByteType;this.offset=new THREE.Vector2(0,0);this.repeat=new THREE.Vector2(1,1);this.generateMipmaps=
true;this.needsUpdate=this.premultiplyAlpha=false;this.onUpdate=null};THREE.Texture.prototype={constructor:THREE.Texture,clone:function(){var a=new THREE.Texture(this.image,this.mapping,this.wrapS,this.wrapT,this.magFilter,this.minFilter,this.format,this.type);a.offset.copy(this.offset);a.repeat.copy(this.repeat);return a}};THREE.TextureCount=0;THREE.MultiplyOperation=0;THREE.MixOperation=1;THREE.UVMapping=function(){};THREE.CubeReflectionMapping=function(){};THREE.CubeRefractionMapping=function(){};
THREE.SphericalReflectionMapping=function(){};THREE.SphericalRefractionMapping=function(){};THREE.RepeatWrapping=0;THREE.ClampToEdgeWrapping=1;THREE.MirroredRepeatWrapping=2;THREE.NearestFilter=3;THREE.NearestMipMapNearestFilter=4;THREE.NearestMipMapLinearFilter=5;THREE.LinearFilter=6;THREE.LinearMipMapNearestFilter=7;THREE.LinearMipMapLinearFilter=8;THREE.UnsignedByteType=9;THREE.ByteType=10;THREE.ShortType=11;THREE.UnsignedShortType=12;THREE.IntType=13;THREE.UnsignedIntType=14;THREE.FloatType=15;
THREE.UnsignedShort4444Type=16;THREE.UnsignedShort5551Type=17;THREE.UnsignedShort565Type=18;THREE.AlphaFormat=19;THREE.RGBFormat=20;THREE.RGBAFormat=21;THREE.LuminanceFormat=22;THREE.LuminanceAlphaFormat=23;THREE.DataTexture=function(a,b,c,d,e,f,g,h,j,k){THREE.Texture.call(this,null,f,g,h,j,k,d,e);this.image={data:a,width:b,height:c}};THREE.DataTexture.prototype=new THREE.Texture;THREE.DataTexture.prototype.constructor=THREE.DataTexture;
THREE.DataTexture.prototype.clone=function(){var a=new THREE.DataTexture(this.image.data,this.image.width,this.image.height,this.format,this.type,this.mapping,this.wrapS,this.wrapT,this.magFilter,this.minFilter);a.offset.copy(this.offset);a.repeat.copy(this.repeat);return a};THREE.Particle=function(a){THREE.Object3D.call(this);this.material=a};THREE.Particle.prototype=new THREE.Object3D;THREE.Particle.prototype.constructor=THREE.Particle;
THREE.ParticleSystem=function(a,b){THREE.Object3D.call(this);this.geometry=a;this.material=b!==void 0?b:new THREE.ParticleBasicMaterial({color:Math.random()*16777215});this.sortParticles=false;if(this.geometry){this.geometry.boundingSphere||this.geometry.computeBoundingSphere();this.boundRadius=a.boundingSphere.radius}this.frustumCulled=false};THREE.ParticleSystem.prototype=new THREE.Object3D;THREE.ParticleSystem.prototype.constructor=THREE.ParticleSystem;
THREE.Line=function(a,b,c){THREE.Object3D.call(this);this.geometry=a;this.material=b!==void 0?b:new THREE.LineBasicMaterial({color:Math.random()*16777215});this.type=c!==void 0?c:THREE.LineStrip;this.geometry&&(this.geometry.boundingSphere||this.geometry.computeBoundingSphere())};THREE.LineStrip=0;THREE.LinePieces=1;THREE.Line.prototype=new THREE.Object3D;THREE.Line.prototype.constructor=THREE.Line;
THREE.Mesh=function(a,b){THREE.Object3D.call(this);this.geometry=a;this.material=b!==void 0?b:new THREE.MeshBasicMaterial({color:Math.random()*16777215,wireframe:true});if(this.geometry){this.geometry.boundingSphere||this.geometry.computeBoundingSphere();this.boundRadius=a.boundingSphere.radius;if(this.geometry.morphTargets.length){this.morphTargetBase=-1;this.morphTargetForcedOrder=[];this.morphTargetInfluences=[];this.morphTargetDictionary={};for(var c=0;c<this.geometry.morphTargets.length;c++){this.morphTargetInfluences.push(0);
this.morphTargetDictionary[this.geometry.morphTargets[c].name]=c}}}};THREE.Mesh.prototype=new THREE.Object3D;THREE.Mesh.prototype.constructor=THREE.Mesh;THREE.Mesh.prototype.getMorphTargetIndexByName=function(a){if(this.morphTargetDictionary[a]!==void 0)return this.morphTargetDictionary[a];console.log("THREE.Mesh.getMorphTargetIndexByName: morph target "+a+" does not exist. Returning 0.");return 0};THREE.Bone=function(a){THREE.Object3D.call(this);this.skin=a;this.skinMatrix=new THREE.Matrix4};
THREE.Bone.prototype=new THREE.Object3D;THREE.Bone.prototype.constructor=THREE.Bone;THREE.Bone.prototype.update=function(a,b){this.matrixAutoUpdate&&(b=b|this.updateMatrix());if(b||this.matrixWorldNeedsUpdate){a?this.skinMatrix.multiply(a,this.matrix):this.skinMatrix.copy(this.matrix);this.matrixWorldNeedsUpdate=false;b=true}var c,d=this.children.length;for(c=0;c<d;c++)this.children[c].update(this.skinMatrix,b)};
THREE.SkinnedMesh=function(a,b){THREE.Mesh.call(this,a,b);this.identityMatrix=new THREE.Matrix4;this.bones=[];this.boneMatrices=[];var c,d,e,f,g,h;if(this.geometry.bones!==void 0){for(c=0;c<this.geometry.bones.length;c++){e=this.geometry.bones[c];f=e.pos;g=e.rotq;h=e.scl;d=this.addBone();d.name=e.name;d.position.set(f[0],f[1],f[2]);d.quaternion.set(g[0],g[1],g[2],g[3]);d.useQuaternion=true;h!==void 0?d.scale.set(h[0],h[1],h[2]):d.scale.set(1,1,1)}for(c=0;c<this.bones.length;c++){e=this.geometry.bones[c];
d=this.bones[c];e.parent===-1?this.add(d):this.bones[e.parent].add(d)}this.boneMatrices=new Float32Array(16*this.bones.length);this.pose()}};THREE.SkinnedMesh.prototype=new THREE.Mesh;THREE.SkinnedMesh.prototype.constructor=THREE.SkinnedMesh;THREE.SkinnedMesh.prototype.addBone=function(a){a===void 0&&(a=new THREE.Bone(this));this.bones.push(a);return a};
THREE.SkinnedMesh.prototype.updateMatrixWorld=function(a){this.matrixAutoUpdate&&this.updateMatrix();if(this.matrixWorldNeedsUpdate||a){this.parent?this.matrixWorld.multiply(this.parent.matrixWorld,this.matrix):this.matrixWorld.copy(this.matrix);this.matrixWorldNeedsUpdate=false}for(var a=0,b=this.children.length;a<b;a++){var c=this.children[a];c instanceof THREE.Bone?c.update(this.identityMatrix,false):c.updateMatrixWorld(true)}for(var b=this.bones.length,c=this.bones,d=this.boneMatrices,a=0;a<b;a++)c[a].skinMatrix.flattenToArrayOffset(d,
a*16)};
THREE.SkinnedMesh.prototype.pose=function(){this.updateMatrixWorld(true);for(var a,b=[],c=0;c<this.bones.length;c++){a=this.bones[c];var d=new THREE.Matrix4;d.getInverse(a.skinMatrix);b.push(d);a.skinMatrix.flattenToArrayOffset(this.boneMatrices,c*16)}if(this.geometry.skinVerticesA===void 0){this.geometry.skinVerticesA=[];this.geometry.skinVerticesB=[];for(a=0;a<this.geometry.skinIndices.length;a++){var c=this.geometry.vertices[a],e=this.geometry.skinIndices[a].x,f=this.geometry.skinIndices[a].y,d=
new THREE.Vector3(c.x,c.y,c.z);this.geometry.skinVerticesA.push(b[e].multiplyVector3(d));d=new THREE.Vector3(c.x,c.y,c.z);this.geometry.skinVerticesB.push(b[f].multiplyVector3(d));if(this.geometry.skinWeights[a].x+this.geometry.skinWeights[a].y!==1){c=(1-(this.geometry.skinWeights[a].x+this.geometry.skinWeights[a].y))*0.5;this.geometry.skinWeights[a].x=this.geometry.skinWeights[a].x+c;this.geometry.skinWeights[a].y=this.geometry.skinWeights[a].y+c}}}};
THREE.MorphAnimMesh=function(a,b){THREE.Mesh.call(this,a,b);this.duration=1E3;this.mirroredLoop=false;this.currentKeyframe=this.lastKeyframe=this.time=0;this.direction=1;this.directionBackwards=false;this.setFrameRange(0,this.geometry.morphTargets.length-1)};THREE.MorphAnimMesh.prototype=new THREE.Mesh;THREE.MorphAnimMesh.prototype.constructor=THREE.MorphAnimMesh;
THREE.MorphAnimMesh.prototype.setFrameRange=function(a,b){this.startKeyframe=a;this.endKeyframe=b;this.length=this.endKeyframe-this.startKeyframe+1};THREE.MorphAnimMesh.prototype.setDirectionForward=function(){this.direction=1;this.directionBackwards=false};THREE.MorphAnimMesh.prototype.setDirectionBackward=function(){this.direction=-1;this.directionBackwards=true};
THREE.MorphAnimMesh.prototype.parseAnimations=function(){var a=this.geometry;if(!a.animations)a.animations={};for(var b,c=a.animations,d=/([a-z]+)(\d+)/,e=0,f=a.morphTargets.length;e<f;e++){var g=a.morphTargets[e].name.match(d);if(g&&g.length>1){g=g[1];c[g]||(c[g]={start:Infinity,end:-Infinity});var h=c[g];if(e<h.start)h.start=e;if(e>h.end)h.end=e;b||(b=g)}}a.firstAnimation=b};
THREE.MorphAnimMesh.prototype.setAnimationLabel=function(a,b,c){if(!this.geometry.animations)this.geometry.animations={};this.geometry.animations[a]={start:b,end:c}};THREE.MorphAnimMesh.prototype.playAnimation=function(a,b){var c=this.geometry.animations[a];if(c){this.setFrameRange(c.start,c.end);this.duration=1E3*((c.end-c.start)/b);this.time=0}else console.warn("animation["+a+"] undefined")};
THREE.MorphAnimMesh.prototype.updateAnimation=function(a){var b=this.duration/this.length;this.time=this.time+this.direction*a;if(this.mirroredLoop){if(this.time>this.duration||this.time<0){this.direction=this.direction*-1;if(this.time>this.duration){this.time=this.duration;this.directionBackwards=true}if(this.time<0){this.time=0;this.directionBackwards=false}}}else{this.time=this.time%this.duration;if(this.time<0)this.time=this.time+this.duration}a=this.startKeyframe+THREE.Math.clamp(Math.floor(this.time/
b),0,this.length-1);if(a!==this.currentKeyframe){this.morphTargetInfluences[this.lastKeyframe]=0;this.morphTargetInfluences[this.currentKeyframe]=1;this.morphTargetInfluences[a]=0;this.lastKeyframe=this.currentKeyframe;this.currentKeyframe=a}b=this.time%b/b;this.directionBackwards&&(b=1-b);this.morphTargetInfluences[this.currentKeyframe]=b;this.morphTargetInfluences[this.lastKeyframe]=1-b};THREE.Ribbon=function(a,b){THREE.Object3D.call(this);this.geometry=a;this.material=b};
THREE.Ribbon.prototype=new THREE.Object3D;THREE.Ribbon.prototype.constructor=THREE.Ribbon;THREE.LOD=function(){THREE.Object3D.call(this);this.LODs=[]};THREE.LOD.prototype=new THREE.Object3D;THREE.LOD.prototype.constructor=THREE.LOD;THREE.LOD.prototype.addLevel=function(a,b){b===void 0&&(b=0);for(var b=Math.abs(b),c=0;c<this.LODs.length;c++)if(b<this.LODs[c].visibleAtDistance)break;this.LODs.splice(c,0,{visibleAtDistance:b,object3D:a});this.add(a)};
THREE.LOD.prototype.update=function(a){if(this.LODs.length>1){a.matrixWorldInverse.getInverse(a.matrixWorld);a=a.matrixWorldInverse;a=-(a.elements[2]*this.matrixWorld.elements[12]+a.elements[6]*this.matrixWorld.elements[13]+a.elements[10]*this.matrixWorld.elements[14]+a.elements[14]);this.LODs[0].object3D.visible=true;for(var b=1;b<this.LODs.length;b++)if(a>=this.LODs[b].visibleAtDistance){this.LODs[b-1].object3D.visible=false;this.LODs[b].object3D.visible=true}else break;for(;b<this.LODs.length;b++)this.LODs[b].object3D.visible=
false}};
THREE.Sprite=function(a){THREE.Object3D.call(this);this.color=a.color!==void 0?new THREE.Color(a.color):new THREE.Color(16777215);this.map=a.map!==void 0?a.map:new THREE.Texture;this.blending=a.blending!==void 0?a.blending:THREE.NormalBlending;this.blendSrc=a.blendSrc!==void 0?a.blendSrc:THREE.SrcAlphaFactor;this.blendDst=a.blendDst!==void 0?a.blendDst:THREE.OneMinusSrcAlphaFactor;this.blendEquation=a.blendEquation!==void 0?a.blendEquation:THREE.AddEquation;this.useScreenCoordinates=a.useScreenCoordinates!==void 0?
a.useScreenCoordinates:true;this.mergeWith3D=a.mergeWith3D!==void 0?a.mergeWith3D:!this.useScreenCoordinates;this.affectedByDistance=a.affectedByDistance!==void 0?a.affectedByDistance:!this.useScreenCoordinates;this.scaleByViewport=a.scaleByViewport!==void 0?a.scaleByViewport:!this.affectedByDistance;this.alignment=a.alignment instanceof THREE.Vector2?a.alignment:THREE.SpriteAlignment.center;this.rotation3d=this.rotation;this.rotation=0;this.opacity=1;this.uvOffset=new THREE.Vector2(0,0);this.uvScale=
new THREE.Vector2(1,1)};THREE.Sprite.prototype=new THREE.Object3D;THREE.Sprite.prototype.constructor=THREE.Sprite;THREE.Sprite.prototype.updateMatrix=function(){this.matrix.setPosition(this.position);this.rotation3d.set(0,0,this.rotation);this.matrix.setRotationFromEuler(this.rotation3d);if(this.scale.x!==1||this.scale.y!==1){this.matrix.scale(this.scale);this.boundRadiusScale=Math.max(this.scale.x,this.scale.y)}this.matrixWorldNeedsUpdate=true};THREE.SpriteAlignment={};
THREE.SpriteAlignment.topLeft=new THREE.Vector2(1,-1);THREE.SpriteAlignment.topCenter=new THREE.Vector2(0,-1);THREE.SpriteAlignment.topRight=new THREE.Vector2(-1,-1);THREE.SpriteAlignment.centerLeft=new THREE.Vector2(1,0);THREE.SpriteAlignment.center=new THREE.Vector2(0,0);THREE.SpriteAlignment.centerRight=new THREE.Vector2(-1,0);THREE.SpriteAlignment.bottomLeft=new THREE.Vector2(1,1);THREE.SpriteAlignment.bottomCenter=new THREE.Vector2(0,1);
THREE.SpriteAlignment.bottomRight=new THREE.Vector2(-1,1);THREE.Scene=function(){THREE.Object3D.call(this);this.overrideMaterial=this.fog=null;this.matrixAutoUpdate=false;this.__objects=[];this.__lights=[];this.__objectsAdded=[];this.__objectsRemoved=[]};THREE.Scene.prototype=new THREE.Object3D;THREE.Scene.prototype.constructor=THREE.Scene;
THREE.Scene.prototype.__addObject=function(a){if(a instanceof THREE.Light)this.__lights.indexOf(a)===-1&&this.__lights.push(a);else if(!(a instanceof THREE.Camera||a instanceof THREE.Bone)&&this.__objects.indexOf(a)===-1){this.__objects.push(a);this.__objectsAdded.push(a);var b=this.__objectsRemoved.indexOf(a);b!==-1&&this.__objectsRemoved.splice(b,1)}for(b=0;b<a.children.length;b++)this.__addObject(a.children[b])};
THREE.Scene.prototype.__removeObject=function(a){if(a instanceof THREE.Light){var b=this.__lights.indexOf(a);b!==-1&&this.__lights.splice(b,1)}else if(!(a instanceof THREE.Camera)){b=this.__objects.indexOf(a);if(b!==-1){this.__objects.splice(b,1);this.__objectsRemoved.push(a);b=this.__objectsAdded.indexOf(a);b!==-1&&this.__objectsAdded.splice(b,1)}}for(b=0;b<a.children.length;b++)this.__removeObject(a.children[b])};
THREE.Fog=function(a,b,c){this.color=new THREE.Color(a);this.near=b!==void 0?b:1;this.far=c!==void 0?c:1E3};THREE.FogExp2=function(a,b){this.color=new THREE.Color(a);this.density=b!==void 0?b:2.5E-4};
THREE.CanvasRenderer=function(a){function b(a){if(t!=a)n.globalAlpha=t=a}function c(a){if(y!=a){switch(a){case THREE.NormalBlending:n.globalCompositeOperation="source-over";break;case THREE.AdditiveBlending:n.globalCompositeOperation="lighter";break;case THREE.SubtractiveBlending:n.globalCompositeOperation="darker"}y=a}}function d(a){if(s!=a)n.strokeStyle=s=a}function e(a){if(x!=a)n.fillStyle=x=a}console.log("THREE.CanvasRenderer",THREE.REVISION);var a=a||{},f=this,g,h,j,k=new THREE.Projector,l=a.canvas!==
void 0?a.canvas:document.createElement("canvas"),o,m,p,r,n=l.getContext("2d"),q=new THREE.Color(0),u=0,t=1,y=0,s=null,x=null,E=null,D=null,A=null,v,H,I,M,R=new THREE.RenderableVertex,Z=new THREE.RenderableVertex,B,G,Q,C,i,P,L,S,aa,N,ca,fa,O=new THREE.Color,$=new THREE.Color,U=new THREE.Color,Y=new THREE.Color,ha=new THREE.Color,Sa=[],Ma=[],Oa,oa,Ta,eb,fb,Za,Lb,mb,jb,nb,ab=new THREE.Rectangle,Ba=new THREE.Rectangle,ya=new THREE.Rectangle,gb=false,wa=new THREE.Color,Pa=new THREE.Color,Da=new THREE.Color,
la=new THREE.Vector3,ob,$a,ac,Ja,pc,Bc,a=16;ob=document.createElement("canvas");ob.width=ob.height=2;$a=ob.getContext("2d");$a.fillStyle="rgba(0,0,0,1)";$a.fillRect(0,0,2,2);ac=$a.getImageData(0,0,2,2);Ja=ac.data;pc=document.createElement("canvas");pc.width=pc.height=a;Bc=pc.getContext("2d");Bc.translate(-a/2,-a/2);Bc.scale(a,a);a--;this.domElement=l;this.sortElements=this.sortObjects=this.autoClear=true;this.info={render:{vertices:0,faces:0}};this.setSize=function(a,b){o=a;m=b;p=Math.floor(o/2);
r=Math.floor(m/2);l.width=o;l.height=m;ab.set(-p,-r,p,r);Ba.set(-p,-r,p,r);t=1;y=0;A=D=E=x=s=null};this.setClearColor=function(a,b){q.copy(a);u=b!==void 0?b:1;Ba.set(-p,-r,p,r)};this.setClearColorHex=function(a,b){q.setHex(a);u=b!==void 0?b:1;Ba.set(-p,-r,p,r)};this.clear=function(){n.setTransform(1,0,0,-1,p,r);if(!Ba.isEmpty()){Ba.minSelf(ab);Ba.inflate(2);u<1&&n.clearRect(Math.floor(Ba.getX()),Math.floor(Ba.getY()),Math.floor(Ba.getWidth()),Math.floor(Ba.getHeight()));if(u>0){c(THREE.NormalBlending);
b(1);e("rgba("+Math.floor(q.r*255)+","+Math.floor(q.g*255)+","+Math.floor(q.b*255)+","+u+")");n.fillRect(Math.floor(Ba.getX()),Math.floor(Ba.getY()),Math.floor(Ba.getWidth()),Math.floor(Ba.getHeight()))}Ba.empty()}};this.render=function(a,l){function m(a){var b,c,d,e;wa.setRGB(0,0,0);Pa.setRGB(0,0,0);Da.setRGB(0,0,0);b=0;for(c=a.length;b<c;b++){d=a[b];e=d.color;if(d instanceof THREE.AmbientLight){wa.r=wa.r+e.r;wa.g=wa.g+e.g;wa.b=wa.b+e.b}else if(d instanceof THREE.DirectionalLight){Pa.r=Pa.r+e.r;
Pa.g=Pa.g+e.g;Pa.b=Pa.b+e.b}else if(d instanceof THREE.PointLight){Da.r=Da.r+e.r;Da.g=Da.g+e.g;Da.b=Da.b+e.b}}}function o(a,b,c,d){var e,f,g,i,h,j;e=0;for(f=a.length;e<f;e++){g=a[e];i=g.color;if(g instanceof THREE.DirectionalLight){h=g.matrixWorld.getPosition();j=c.dot(h);if(!(j<=0)){j=j*g.intensity;d.r=d.r+i.r*j;d.g=d.g+i.g*j;d.b=d.b+i.b*j}}else if(g instanceof THREE.PointLight){h=g.matrixWorld.getPosition();j=c.dot(la.sub(h,b).normalize());if(!(j<=0)){j=j*(g.distance==0?1:1-Math.min(b.distanceTo(h)/
g.distance,1));if(j!=0){j=j*g.intensity;d.r=d.r+i.r*j;d.g=d.g+i.g*j;d.b=d.b+i.b*j}}}}}function q(a,f,g){b(g.opacity);c(g.blending);var i,h,j,l,k,m;if(g instanceof THREE.ParticleBasicMaterial){if(g.map){l=g.map.image;k=l.width>>1;m=l.height>>1;g=f.scale.x*p;j=f.scale.y*r;i=g*k;h=j*m;ya.set(a.x-i,a.y-h,a.x+i,a.y+h);if(ab.intersects(ya)){n.save();n.translate(a.x,a.y);n.rotate(-f.rotation);n.scale(g,-j);n.translate(-k,-m);n.drawImage(l,0,0);n.restore()}}}else if(g instanceof THREE.ParticleCanvasMaterial){i=
f.scale.x*p;h=f.scale.y*r;ya.set(a.x-i,a.y-h,a.x+i,a.y+h);if(ab.intersects(ya)){d(g.color.getContextStyle());e(g.color.getContextStyle());n.save();n.translate(a.x,a.y);n.rotate(-f.rotation);n.scale(i,h);g.program(n);n.restore()}}}function s(a,e,f,g){b(g.opacity);c(g.blending);n.beginPath();n.moveTo(a.positionScreen.x,a.positionScreen.y);n.lineTo(e.positionScreen.x,e.positionScreen.y);n.closePath();if(g instanceof THREE.LineBasicMaterial){a=g.linewidth;if(E!=a)n.lineWidth=E=a;a=g.linecap;if(D!=a)n.lineCap=
D=a;a=g.linejoin;if(A!=a)n.lineJoin=A=a;d(g.color.getContextStyle());n.stroke();ya.inflate(g.linewidth*2)}}function t(a,d,e,g,h,k,m,n){f.info.render.vertices=f.info.render.vertices+3;f.info.render.faces++;b(n.opacity);c(n.blending);B=a.positionScreen.x;G=a.positionScreen.y;Q=d.positionScreen.x;C=d.positionScreen.y;i=e.positionScreen.x;P=e.positionScreen.y;x(B,G,Q,C,i,P);if(n instanceof THREE.MeshBasicMaterial)if(n.map){if(n.map.mapping instanceof THREE.UVMapping){eb=m.uvs[0];$c(B,G,Q,C,i,P,eb[g].u,
eb[g].v,eb[h].u,eb[h].v,eb[k].u,eb[k].v,n.map)}}else if(n.envMap){if(n.envMap.mapping instanceof THREE.SphericalReflectionMapping){a=l.matrixWorldInverse;la.copy(m.vertexNormalsWorld[g]);fb=(la.x*a.elements[0]+la.y*a.elements[4]+la.z*a.elements[8])*0.5+0.5;Za=-(la.x*a.elements[1]+la.y*a.elements[5]+la.z*a.elements[9])*0.5+0.5;la.copy(m.vertexNormalsWorld[h]);Lb=(la.x*a.elements[0]+la.y*a.elements[4]+la.z*a.elements[8])*0.5+0.5;mb=-(la.x*a.elements[1]+la.y*a.elements[5]+la.z*a.elements[9])*0.5+0.5;
la.copy(m.vertexNormalsWorld[k]);jb=(la.x*a.elements[0]+la.y*a.elements[4]+la.z*a.elements[8])*0.5+0.5;nb=-(la.x*a.elements[1]+la.y*a.elements[5]+la.z*a.elements[9])*0.5+0.5;$c(B,G,Q,C,i,P,fb,Za,Lb,mb,jb,nb,n.envMap)}}else n.wireframe?Mb(n.color,n.wireframeLinewidth,n.wireframeLinecap,n.wireframeLinejoin):Fb(n.color);else if(n instanceof THREE.MeshLambertMaterial)if(gb)if(!n.wireframe&&n.shading==THREE.SmoothShading&&m.vertexNormalsWorld.length==3){$.r=U.r=Y.r=wa.r;$.g=U.g=Y.g=wa.g;$.b=U.b=Y.b=wa.b;
o(j,m.v1.positionWorld,m.vertexNormalsWorld[0],$);o(j,m.v2.positionWorld,m.vertexNormalsWorld[1],U);o(j,m.v3.positionWorld,m.vertexNormalsWorld[2],Y);$.r=Math.max(0,Math.min(n.color.r*$.r,1));$.g=Math.max(0,Math.min(n.color.g*$.g,1));$.b=Math.max(0,Math.min(n.color.b*$.b,1));U.r=Math.max(0,Math.min(n.color.r*U.r,1));U.g=Math.max(0,Math.min(n.color.g*U.g,1));U.b=Math.max(0,Math.min(n.color.b*U.b,1));Y.r=Math.max(0,Math.min(n.color.r*Y.r,1));Y.g=Math.max(0,Math.min(n.color.g*Y.g,1));Y.b=Math.max(0,
Math.min(n.color.b*Y.b,1));ha.r=(U.r+Y.r)*0.5;ha.g=(U.g+Y.g)*0.5;ha.b=(U.b+Y.b)*0.5;Ta=Cc($,U,Y,ha);hc(B,G,Q,C,i,P,0,0,1,0,0,1,Ta)}else{O.r=wa.r;O.g=wa.g;O.b=wa.b;o(j,m.centroidWorld,m.normalWorld,O);O.r=Math.max(0,Math.min(n.color.r*O.r,1));O.g=Math.max(0,Math.min(n.color.g*O.g,1));O.b=Math.max(0,Math.min(n.color.b*O.b,1));n.wireframe?Mb(O,n.wireframeLinewidth,n.wireframeLinecap,n.wireframeLinejoin):Fb(O)}else n.wireframe?Mb(n.color,n.wireframeLinewidth,n.wireframeLinecap,n.wireframeLinejoin):Fb(n.color);
else if(n instanceof THREE.MeshDepthMaterial){Oa=l.near;oa=l.far;$.r=$.g=$.b=1-bc(a.positionScreen.z,Oa,oa);U.r=U.g=U.b=1-bc(d.positionScreen.z,Oa,oa);Y.r=Y.g=Y.b=1-bc(e.positionScreen.z,Oa,oa);ha.r=(U.r+Y.r)*0.5;ha.g=(U.g+Y.g)*0.5;ha.b=(U.b+Y.b)*0.5;Ta=Cc($,U,Y,ha);hc(B,G,Q,C,i,P,0,0,1,0,0,1,Ta)}else if(n instanceof THREE.MeshNormalMaterial){O.r=ic(m.normalWorld.x);O.g=ic(m.normalWorld.y);O.b=ic(m.normalWorld.z);n.wireframe?Mb(O,n.wireframeLinewidth,n.wireframeLinecap,n.wireframeLinejoin):Fb(O)}}
function u(a,d,e,g,h,k,n,m,p){f.info.render.vertices=f.info.render.vertices+4;f.info.render.faces++;b(m.opacity);c(m.blending);if(m.map||m.envMap){t(a,d,g,0,1,3,n,m,p);t(h,e,k,1,2,3,n,m,p)}else{B=a.positionScreen.x;G=a.positionScreen.y;Q=d.positionScreen.x;C=d.positionScreen.y;i=e.positionScreen.x;P=e.positionScreen.y;L=g.positionScreen.x;S=g.positionScreen.y;aa=h.positionScreen.x;N=h.positionScreen.y;ca=k.positionScreen.x;fa=k.positionScreen.y;if(m instanceof THREE.MeshBasicMaterial){y(B,G,Q,C,i,
P,L,S);m.wireframe?Mb(m.color,m.wireframeLinewidth,m.wireframeLinecap,m.wireframeLinejoin):Fb(m.color)}else if(m instanceof THREE.MeshLambertMaterial)if(gb)if(!m.wireframe&&m.shading==THREE.SmoothShading&&n.vertexNormalsWorld.length==4){$.r=U.r=Y.r=ha.r=wa.r;$.g=U.g=Y.g=ha.g=wa.g;$.b=U.b=Y.b=ha.b=wa.b;o(j,n.v1.positionWorld,n.vertexNormalsWorld[0],$);o(j,n.v2.positionWorld,n.vertexNormalsWorld[1],U);o(j,n.v4.positionWorld,n.vertexNormalsWorld[3],Y);o(j,n.v3.positionWorld,n.vertexNormalsWorld[2],ha);
$.r=Math.max(0,Math.min(m.color.r*$.r,1));$.g=Math.max(0,Math.min(m.color.g*$.g,1));$.b=Math.max(0,Math.min(m.color.b*$.b,1));U.r=Math.max(0,Math.min(m.color.r*U.r,1));U.g=Math.max(0,Math.min(m.color.g*U.g,1));U.b=Math.max(0,Math.min(m.color.b*U.b,1));Y.r=Math.max(0,Math.min(m.color.r*Y.r,1));Y.g=Math.max(0,Math.min(m.color.g*Y.g,1));Y.b=Math.max(0,Math.min(m.color.b*Y.b,1));ha.r=Math.max(0,Math.min(m.color.r*ha.r,1));ha.g=Math.max(0,Math.min(m.color.g*ha.g,1));ha.b=Math.max(0,Math.min(m.color.b*
ha.b,1));Ta=Cc($,U,Y,ha);x(B,G,Q,C,L,S);hc(B,G,Q,C,L,S,0,0,1,0,0,1,Ta);x(aa,N,i,P,ca,fa);hc(aa,N,i,P,ca,fa,1,0,1,1,0,1,Ta)}else{O.r=wa.r;O.g=wa.g;O.b=wa.b;o(j,n.centroidWorld,n.normalWorld,O);O.r=Math.max(0,Math.min(m.color.r*O.r,1));O.g=Math.max(0,Math.min(m.color.g*O.g,1));O.b=Math.max(0,Math.min(m.color.b*O.b,1));y(B,G,Q,C,i,P,L,S);m.wireframe?Mb(O,m.wireframeLinewidth,m.wireframeLinecap,m.wireframeLinejoin):Fb(O)}else{y(B,G,Q,C,i,P,L,S);m.wireframe?Mb(m.color,m.wireframeLinewidth,m.wireframeLinecap,
m.wireframeLinejoin):Fb(m.color)}else if(m instanceof THREE.MeshNormalMaterial){O.r=ic(n.normalWorld.x);O.g=ic(n.normalWorld.y);O.b=ic(n.normalWorld.z);y(B,G,Q,C,i,P,L,S);m.wireframe?Mb(O,m.wireframeLinewidth,m.wireframeLinecap,m.wireframeLinejoin):Fb(O)}else if(m instanceof THREE.MeshDepthMaterial){Oa=l.near;oa=l.far;$.r=$.g=$.b=1-bc(a.positionScreen.z,Oa,oa);U.r=U.g=U.b=1-bc(d.positionScreen.z,Oa,oa);Y.r=Y.g=Y.b=1-bc(g.positionScreen.z,Oa,oa);ha.r=ha.g=ha.b=1-bc(e.positionScreen.z,Oa,oa);Ta=Cc($,
U,Y,ha);x(B,G,Q,C,L,S);hc(B,G,Q,C,L,S,0,0,1,0,0,1,Ta);x(aa,N,i,P,ca,fa);hc(aa,N,i,P,ca,fa,1,0,1,1,0,1,Ta)}}}function x(a,b,c,d,e,f){n.beginPath();n.moveTo(a,b);n.lineTo(c,d);n.lineTo(e,f);n.lineTo(a,b)}function y(a,b,c,d,e,f,g,i){n.beginPath();n.moveTo(a,b);n.lineTo(c,d);n.lineTo(e,f);n.lineTo(g,i);n.lineTo(a,b)}function Mb(a,b,c,e){if(E!=b)n.lineWidth=E=b;if(D!=c)n.lineCap=D=c;if(A!=e)n.lineJoin=A=e;d(a.getContextStyle());n.stroke();ya.inflate(b*2)}function Fb(a){e(a.getContextStyle());n.fill()}
function $c(a,b,c,d,f,g,i,h,j,k,l,m,o){if(!(o.image===void 0||o.image.width===0)){if(o.needsUpdate===true||Sa[o.id]===void 0){var p=o.wrapS==THREE.RepeatWrapping,Ja=o.wrapT==THREE.RepeatWrapping;Sa[o.id]=n.createPattern(o.image,p&&Ja?"repeat":p&&!Ja?"repeat-x":!p&&Ja?"repeat-y":"no-repeat");o.needsUpdate=false}e(Sa[o.id]);var p=o.offset.x/o.repeat.x,Ja=o.offset.y/o.repeat.y,r=o.image.width*o.repeat.x,q=o.image.height*o.repeat.y,i=(i+p)*r,h=(h+Ja)*q,c=c-a,d=d-b,f=f-a,g=g-b,j=(j+p)*r-i,k=(k+Ja)*q-h,
l=(l+p)*r-i,m=(m+Ja)*q-h,p=j*m-l*k;if(p==0){if(Ma[o.id]===void 0){b=document.createElement("canvas");b.width=o.image.width;b.height=o.image.height;b=b.getContext("2d");b.drawImage(o.image,0,0);Ma[o.id]=b.getImageData(0,0,o.image.width,o.image.height).data}b=Ma[o.id];i=(Math.floor(i)+Math.floor(h)*o.image.width)*4;O.setRGB(b[i]/255,b[i+1]/255,b[i+2]/255);Fb(O)}else{p=1/p;o=(m*c-k*f)*p;k=(m*d-k*g)*p;c=(j*f-l*c)*p;d=(j*g-l*d)*p;a=a-o*i-c*h;i=b-k*i-d*h;n.save();n.transform(o,k,c,d,a,i);n.fill();n.restore()}}}
function hc(a,b,c,d,e,f,g,i,h,j,k,l,m){var o,p;o=m.width-1;p=m.height-1;g=g*o;i=i*p;c=c-a;d=d-b;e=e-a;f=f-b;h=h*o-g;j=j*p-i;k=k*o-g;l=l*p-i;p=1/(h*l-k*j);o=(l*c-j*e)*p;j=(l*d-j*f)*p;c=(h*e-k*c)*p;d=(h*f-k*d)*p;a=a-o*g-c*i;b=b-j*g-d*i;n.save();n.transform(o,j,c,d,a,b);n.clip();n.drawImage(m,0,0);n.restore()}function Cc(a,b,c,d){var e=~~(a.r*255),f=~~(a.g*255),a=~~(a.b*255),g=~~(b.r*255),i=~~(b.g*255),b=~~(b.b*255),h=~~(c.r*255),j=~~(c.g*255),c=~~(c.b*255),k=~~(d.r*255),l=~~(d.g*255),d=~~(d.b*255);
Ja[0]=e<0?0:e>255?255:e;Ja[1]=f<0?0:f>255?255:f;Ja[2]=a<0?0:a>255?255:a;Ja[4]=g<0?0:g>255?255:g;Ja[5]=i<0?0:i>255?255:i;Ja[6]=b<0?0:b>255?255:b;Ja[8]=h<0?0:h>255?255:h;Ja[9]=j<0?0:j>255?255:j;Ja[10]=c<0?0:c>255?255:c;Ja[12]=k<0?0:k>255?255:k;Ja[13]=l<0?0:l>255?255:l;Ja[14]=d<0?0:d>255?255:d;$a.putImageData(ac,0,0);Bc.drawImage(ob,0,0);return pc}function bc(a,b,c){a=(a-b)/(c-b);return a*a*(3-2*a)}function ic(a){a=(a+1)*0.5;return a<0?0:a>1?1:a}function Nb(a,b){var c=b.x-a.x,d=b.y-a.y,e=c*c+d*d;if(e!=
0){e=1/Math.sqrt(e);c=c*e;d=d*e;b.x=b.x+c;b.y=b.y+d;a.x=a.x-c;a.y=a.y-d}}var Dc,ad,Ka,hb;this.autoClear?this.clear():n.setTransform(1,0,0,-1,p,r);f.info.render.vertices=0;f.info.render.faces=0;g=k.projectScene(a,l,this.sortElements);h=g.elements;j=g.lights;(gb=j.length>0)&&m(j);Dc=0;for(ad=h.length;Dc<ad;Dc++){Ka=h[Dc];hb=Ka.material;hb=hb instanceof THREE.MeshFaceMaterial?Ka.faceMaterial:hb;if(!(hb===void 0||hb.visible===false)){ya.empty();if(Ka instanceof THREE.RenderableParticle){v=Ka;v.x=v.x*
p;v.y=v.y*r;q(v,Ka,hb,a)}else if(Ka instanceof THREE.RenderableLine){v=Ka.v1;H=Ka.v2;v.positionScreen.x=v.positionScreen.x*p;v.positionScreen.y=v.positionScreen.y*r;H.positionScreen.x=H.positionScreen.x*p;H.positionScreen.y=H.positionScreen.y*r;ya.addPoint(v.positionScreen.x,v.positionScreen.y);ya.addPoint(H.positionScreen.x,H.positionScreen.y);ab.intersects(ya)&&s(v,H,Ka,hb,a)}else if(Ka instanceof THREE.RenderableFace3){v=Ka.v1;H=Ka.v2;I=Ka.v3;v.positionScreen.x=v.positionScreen.x*p;v.positionScreen.y=
v.positionScreen.y*r;H.positionScreen.x=H.positionScreen.x*p;H.positionScreen.y=H.positionScreen.y*r;I.positionScreen.x=I.positionScreen.x*p;I.positionScreen.y=I.positionScreen.y*r;if(hb.overdraw){Nb(v.positionScreen,H.positionScreen);Nb(H.positionScreen,I.positionScreen);Nb(I.positionScreen,v.positionScreen)}ya.add3Points(v.positionScreen.x,v.positionScreen.y,H.positionScreen.x,H.positionScreen.y,I.positionScreen.x,I.positionScreen.y);ab.intersects(ya)&&t(v,H,I,0,1,2,Ka,hb,a)}else if(Ka instanceof
THREE.RenderableFace4){v=Ka.v1;H=Ka.v2;I=Ka.v3;M=Ka.v4;v.positionScreen.x=v.positionScreen.x*p;v.positionScreen.y=v.positionScreen.y*r;H.positionScreen.x=H.positionScreen.x*p;H.positionScreen.y=H.positionScreen.y*r;I.positionScreen.x=I.positionScreen.x*p;I.positionScreen.y=I.positionScreen.y*r;M.positionScreen.x=M.positionScreen.x*p;M.positionScreen.y=M.positionScreen.y*r;R.positionScreen.copy(H.positionScreen);Z.positionScreen.copy(M.positionScreen);if(hb.overdraw){Nb(v.positionScreen,H.positionScreen);
Nb(H.positionScreen,M.positionScreen);Nb(M.positionScreen,v.positionScreen);Nb(I.positionScreen,R.positionScreen);Nb(I.positionScreen,Z.positionScreen)}ya.addPoint(v.positionScreen.x,v.positionScreen.y);ya.addPoint(H.positionScreen.x,H.positionScreen.y);ya.addPoint(I.positionScreen.x,I.positionScreen.y);ya.addPoint(M.positionScreen.x,M.positionScreen.y);ab.intersects(ya)&&u(v,H,I,M,R,Z,Ka,hb,a)}Ba.addRectangle(ya)}}n.setTransform(1,0,0,1,0,0)}};
THREE.ShaderChunk={fog_pars_fragment:"#ifdef USE_FOG\nuniform vec3 fogColor;\n#ifdef FOG_EXP2\nuniform float fogDensity;\n#else\nuniform float fogNear;\nuniform float fogFar;\n#endif\n#endif",fog_fragment:"#ifdef USE_FOG\nfloat depth = gl_FragCoord.z / gl_FragCoord.w;\n#ifdef FOG_EXP2\nconst float LOG2 = 1.442695;\nfloat fogFactor = exp2( - fogDensity * fogDensity * depth * depth * LOG2 );\nfogFactor = 1.0 - clamp( fogFactor, 0.0, 1.0 );\n#else\nfloat fogFactor = smoothstep( fogNear, fogFar, depth );\n#endif\ngl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );\n#endif",
envmap_pars_fragment:"#ifdef USE_ENVMAP\nvarying vec3 vReflect;\nuniform float reflectivity;\nuniform samplerCube envMap;\nuniform float flipEnvMap;\nuniform int combine;\n#endif",envmap_fragment:"#ifdef USE_ENVMAP\n#ifdef DOUBLE_SIDED\nfloat flipNormal = ( -1.0 + 2.0 * float( gl_FrontFacing ) );\nvec4 cubeColor = textureCube( envMap, flipNormal * vec3( flipEnvMap * vReflect.x, vReflect.yz ) );\n#else\nvec4 cubeColor = textureCube( envMap, vec3( flipEnvMap * vReflect.x, vReflect.yz ) );\n#endif\n#ifdef GAMMA_INPUT\ncubeColor.xyz *= cubeColor.xyz;\n#endif\nif ( combine == 1 ) {\ngl_FragColor.xyz = mix( gl_FragColor.xyz, cubeColor.xyz, reflectivity );\n} else {\ngl_FragColor.xyz = gl_FragColor.xyz * cubeColor.xyz;\n}\n#endif",
envmap_pars_vertex:"#ifdef USE_ENVMAP\nvarying vec3 vReflect;\nuniform float refractionRatio;\nuniform bool useRefract;\n#endif",envmap_vertex:"#ifdef USE_ENVMAP\nvec4 mPosition = objectMatrix * vec4( position, 1.0 );\nvec3 nWorld = mat3( objectMatrix[ 0 ].xyz, objectMatrix[ 1 ].xyz, objectMatrix[ 2 ].xyz ) * normal;\nif ( useRefract ) {\nvReflect = refract( normalize( mPosition.xyz - cameraPosition ), normalize( nWorld.xyz ), refractionRatio );\n} else {\nvReflect = reflect( normalize( mPosition.xyz - cameraPosition ), normalize( nWorld.xyz ) );\n}\n#endif",
map_particle_pars_fragment:"#ifdef USE_MAP\nuniform sampler2D map;\n#endif",map_particle_fragment:"#ifdef USE_MAP\ngl_FragColor = gl_FragColor * texture2D( map, gl_PointCoord );\n#endif",map_pars_vertex:"#ifdef USE_MAP\nvarying vec2 vUv;\nuniform vec4 offsetRepeat;\n#endif",map_pars_fragment:"#ifdef USE_MAP\nvarying vec2 vUv;\nuniform sampler2D map;\n#endif",map_vertex:"#ifdef USE_MAP\nvUv = uv * offsetRepeat.zw + offsetRepeat.xy;\n#endif",map_fragment:"#ifdef USE_MAP\n#ifdef GAMMA_INPUT\nvec4 texelColor = texture2D( map, vUv );\ntexelColor.xyz *= texelColor.xyz;\ngl_FragColor = gl_FragColor * texelColor;\n#else\ngl_FragColor = gl_FragColor * texture2D( map, vUv );\n#endif\n#endif",
lightmap_pars_fragment:"#ifdef USE_LIGHTMAP\nvarying vec2 vUv2;\nuniform sampler2D lightMap;\n#endif",lightmap_pars_vertex:"#ifdef USE_LIGHTMAP\nvarying vec2 vUv2;\n#endif",lightmap_fragment:"#ifdef USE_LIGHTMAP\ngl_FragColor = gl_FragColor * texture2D( lightMap, vUv2 );\n#endif",lightmap_vertex:"#ifdef USE_LIGHTMAP\nvUv2 = uv2;\n#endif",lights_lambert_pars_vertex:"uniform vec3 ambient;\nuniform vec3 diffuse;\nuniform vec3 emissive;\nuniform vec3 ambientLightColor;\n#if MAX_DIR_LIGHTS > 0\nuniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];\nuniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];\n#endif\n#if MAX_POINT_LIGHTS > 0\nuniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];\nuniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];\nuniform float pointLightDistance[ MAX_POINT_LIGHTS ];\n#endif\n#if MAX_SPOT_LIGHTS > 0\nuniform vec3 spotLightColor[ MAX_SPOT_LIGHTS ];\nuniform vec3 spotLightPosition[ MAX_SPOT_LIGHTS ];\nuniform vec3 spotLightDirection[ MAX_SPOT_LIGHTS ];\nuniform float spotLightDistance[ MAX_SPOT_LIGHTS ];\nuniform float spotLightAngle[ MAX_SPOT_LIGHTS ];\nuniform float spotLightExponent[ MAX_SPOT_LIGHTS ];\n#endif\n#ifdef WRAP_AROUND\nuniform vec3 wrapRGB;\n#endif",
lights_lambert_vertex:"vLightFront = vec3( 0.0 );\n#ifdef DOUBLE_SIDED\nvLightBack = vec3( 0.0 );\n#endif\ntransformedNormal = normalize( transformedNormal );\n#if MAX_DIR_LIGHTS > 0\nfor( int i = 0; i < MAX_DIR_LIGHTS; i ++ ) {\nvec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );\nvec3 dirVector = normalize( lDirection.xyz );\nfloat dotProduct = dot( transformedNormal, dirVector );\nvec3 directionalLightWeighting = vec3( max( dotProduct, 0.0 ) );\n#ifdef DOUBLE_SIDED\nvec3 directionalLightWeightingBack = vec3( max( -dotProduct, 0.0 ) );\n#ifdef WRAP_AROUND\nvec3 directionalLightWeightingHalfBack = vec3( max( -0.5 * dotProduct + 0.5, 0.0 ) );\n#endif\n#endif\n#ifdef WRAP_AROUND\nvec3 directionalLightWeightingHalf = vec3( max( 0.5 * dotProduct + 0.5, 0.0 ) );\ndirectionalLightWeighting = mix( directionalLightWeighting, directionalLightWeightingHalf, wrapRGB );\n#ifdef DOUBLE_SIDED\ndirectionalLightWeightingBack = mix( directionalLightWeightingBack, directionalLightWeightingHalfBack, wrapRGB );\n#endif\n#endif\nvLightFront += directionalLightColor[ i ] * directionalLightWeighting;\n#ifdef DOUBLE_SIDED\nvLightBack += directionalLightColor[ i ] * directionalLightWeightingBack;\n#endif\n}\n#endif\n#if MAX_POINT_LIGHTS > 0\nfor( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {\nvec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );\nvec3 lVector = lPosition.xyz - mvPosition.xyz;\nfloat lDistance = 1.0;\nif ( pointLightDistance[ i ] > 0.0 )\nlDistance = 1.0 - min( ( length( lVector ) / pointLightDistance[ i ] ), 1.0 );\nlVector = normalize( lVector );\nfloat dotProduct = dot( transformedNormal, lVector );\nvec3 pointLightWeighting = vec3( max( dotProduct, 0.0 ) );\n#ifdef DOUBLE_SIDED\nvec3 pointLightWeightingBack = vec3( max( -dotProduct, 0.0 ) );\n#ifdef WRAP_AROUND\nvec3 pointLightWeightingHalfBack = vec3( max( -0.5 * dotProduct + 0.5, 0.0 ) );\n#endif\n#endif\n#ifdef WRAP_AROUND\nvec3 pointLightWeightingHalf = vec3( max( 0.5 * dotProduct + 0.5, 0.0 ) );\npointLightWeighting = mix( pointLightWeighting, pointLightWeightingHalf, wrapRGB );\n#ifdef DOUBLE_SIDED\npointLightWeightingBack = mix( pointLightWeightingBack, pointLightWeightingHalfBack, wrapRGB );\n#endif\n#endif\nvLightFront += pointLightColor[ i ] * pointLightWeighting * lDistance;\n#ifdef DOUBLE_SIDED\nvLightBack += pointLightColor[ i ] * pointLightWeightingBack * lDistance;\n#endif\n}\n#endif\n#if MAX_SPOT_LIGHTS > 0\nfor( int i = 0; i < MAX_SPOT_LIGHTS; i ++ ) {\nvec4 lPosition = viewMatrix * vec4( spotLightPosition[ i ], 1.0 );\nvec3 lVector = lPosition.xyz - mvPosition.xyz;\nlVector = normalize( lVector );\nfloat spotEffect = dot( spotLightDirection[ i ], normalize( spotLightPosition[ i ] - mPosition.xyz ) );\nif ( spotEffect > spotLightAngle[ i ] ) {\nspotEffect = pow( spotEffect, spotLightExponent[ i ] );\nfloat lDistance = 1.0;\nif ( spotLightDistance[ i ] > 0.0 )\nlDistance = 1.0 - min( ( length( lVector ) / spotLightDistance[ i ] ), 1.0 );\nfloat dotProduct = dot( transformedNormal, lVector );\nvec3 spotLightWeighting = vec3( max( dotProduct, 0.0 ) );\n#ifdef DOUBLE_SIDED\nvec3 spotLightWeightingBack = vec3( max( -dotProduct, 0.0 ) );\n#ifdef WRAP_AROUND\nvec3 spotLightWeightingHalfBack = vec3( max( -0.5 * dotProduct + 0.5, 0.0 ) );\n#endif\n#endif\n#ifdef WRAP_AROUND\nvec3 spotLightWeightingHalf = vec3( max( 0.5 * dotProduct + 0.5, 0.0 ) );\nspotLightWeighting = mix( spotLightWeighting, spotLightWeightingHalf, wrapRGB );\n#ifdef DOUBLE_SIDED\nspotLightWeightingBack = mix( spotLightWeightingBack, spotLightWeightingHalfBack, wrapRGB );\n#endif\n#endif\nvLightFront += spotLightColor[ i ] * spotLightWeighting * lDistance * spotEffect;\n#ifdef DOUBLE_SIDED\nvLightBack += spotLightColor[ i ] * spotLightWeightingBack * lDistance * spotEffect;\n#endif\n}\n}\n#endif\nvLightFront = vLightFront * diffuse + ambient * ambientLightColor + emissive;\n#ifdef DOUBLE_SIDED\nvLightBack = vLightBack * diffuse + ambient * ambientLightColor + emissive;\n#endif",
lights_phong_pars_vertex:"#ifndef PHONG_PER_PIXEL\n#if MAX_POINT_LIGHTS > 0\nuniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];\nuniform float pointLightDistance[ MAX_POINT_LIGHTS ];\nvarying vec4 vPointLight[ MAX_POINT_LIGHTS ];\n#endif\n#if MAX_SPOT_LIGHTS > 0\nuniform vec3 spotLightPosition[ MAX_SPOT_LIGHTS ];\nuniform float spotLightDistance[ MAX_SPOT_LIGHTS ];\nvarying vec4 vSpotLight[ MAX_SPOT_LIGHTS ];\n#endif\n#endif\n#if MAX_SPOT_LIGHTS > 0\nvarying vec3 vWorldPosition;\n#endif",lights_phong_vertex:"#ifndef PHONG_PER_PIXEL\n#if MAX_POINT_LIGHTS > 0\nfor( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {\nvec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );\nvec3 lVector = lPosition.xyz - mvPosition.xyz;\nfloat lDistance = 1.0;\nif ( pointLightDistance[ i ] > 0.0 )\nlDistance = 1.0 - min( ( length( lVector ) / pointLightDistance[ i ] ), 1.0 );\nvPointLight[ i ] = vec4( lVector, lDistance );\n}\n#endif\n#if MAX_SPOT_LIGHTS > 0\nfor( int i = 0; i < MAX_SPOT_LIGHTS; i ++ ) {\nvec4 lPosition = viewMatrix * vec4( spotLightPosition[ i ], 1.0 );\nvec3 lVector = lPosition.xyz - mvPosition.xyz;\nfloat lDistance = 1.0;\nif ( spotLightDistance[ i ] > 0.0 )\nlDistance = 1.0 - min( ( length( lVector ) / spotLightDistance[ i ] ), 1.0 );\nvSpotLight[ i ] = vec4( lVector, lDistance );\n}\n#endif\n#endif\n#if MAX_SPOT_LIGHTS > 0\nvWorldPosition = mPosition.xyz;\n#endif",
lights_phong_pars_fragment:"uniform vec3 ambientLightColor;\n#if MAX_DIR_LIGHTS > 0\nuniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];\nuniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];\n#endif\n#if MAX_POINT_LIGHTS > 0\nuniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];\n#ifdef PHONG_PER_PIXEL\nuniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];\nuniform float pointLightDistance[ MAX_POINT_LIGHTS ];\n#else\nvarying vec4 vPointLight[ MAX_POINT_LIGHTS ];\n#endif\n#endif\n#if MAX_SPOT_LIGHTS > 0\nuniform vec3 spotLightColor[ MAX_SPOT_LIGHTS ];\nuniform vec3 spotLightPosition[ MAX_SPOT_LIGHTS ];\nuniform vec3 spotLightDirection[ MAX_SPOT_LIGHTS ];\nuniform float spotLightAngle[ MAX_SPOT_LIGHTS ];\nuniform float spotLightExponent[ MAX_SPOT_LIGHTS ];\n#ifdef PHONG_PER_PIXEL\nuniform float spotLightDistance[ MAX_SPOT_LIGHTS ];\n#else\nvarying vec4 vSpotLight[ MAX_SPOT_LIGHTS ];\n#endif\nvarying vec3 vWorldPosition;\n#endif\n#ifdef WRAP_AROUND\nuniform vec3 wrapRGB;\n#endif\nvarying vec3 vViewPosition;\nvarying vec3 vNormal;",
lights_phong_fragment:"vec3 normal = normalize( vNormal );\nvec3 viewPosition = normalize( vViewPosition );\n#ifdef DOUBLE_SIDED\nnormal = normal * ( -1.0 + 2.0 * float( gl_FrontFacing ) );\n#endif\n#if MAX_POINT_LIGHTS > 0\nvec3 pointDiffuse  = vec3( 0.0 );\nvec3 pointSpecular = vec3( 0.0 );\nfor ( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {\n#ifdef PHONG_PER_PIXEL\nvec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );\nvec3 lVector = lPosition.xyz + vViewPosition.xyz;\nfloat lDistance = 1.0;\nif ( pointLightDistance[ i ] > 0.0 )\nlDistance = 1.0 - min( ( length( lVector ) / pointLightDistance[ i ] ), 1.0 );\nlVector = normalize( lVector );\n#else\nvec3 lVector = normalize( vPointLight[ i ].xyz );\nfloat lDistance = vPointLight[ i ].w;\n#endif\nfloat dotProduct = dot( normal, lVector );\n#ifdef WRAP_AROUND\nfloat pointDiffuseWeightFull = max( dotProduct, 0.0 );\nfloat pointDiffuseWeightHalf = max( 0.5 * dotProduct + 0.5, 0.0 );\nvec3 pointDiffuseWeight = mix( vec3 ( pointDiffuseWeightFull ), vec3( pointDiffuseWeightHalf ), wrapRGB );\n#else\nfloat pointDiffuseWeight = max( dotProduct, 0.0 );\n#endif\npointDiffuse  += diffuse * pointLightColor[ i ] * pointDiffuseWeight * lDistance;\nvec3 pointHalfVector = normalize( lVector + viewPosition );\nfloat pointDotNormalHalf = max( dot( normal, pointHalfVector ), 0.0 );\nfloat pointSpecularWeight = max( pow( pointDotNormalHalf, shininess ), 0.0 );\n#ifdef PHYSICALLY_BASED_SHADING\nfloat specularNormalization = ( shininess + 2.0001 ) / 8.0;\nvec3 schlick = specular + vec3( 1.0 - specular ) * pow( 1.0 - dot( lVector, pointHalfVector ), 5.0 );\npointSpecular += schlick * pointLightColor[ i ] * pointSpecularWeight * pointDiffuseWeight * lDistance * specularNormalization;\n#else\npointSpecular += specular * pointLightColor[ i ] * pointSpecularWeight * pointDiffuseWeight * lDistance;\n#endif\n}\n#endif\n#if MAX_SPOT_LIGHTS > 0\nvec3 spotDiffuse  = vec3( 0.0 );\nvec3 spotSpecular = vec3( 0.0 );\nfor ( int i = 0; i < MAX_SPOT_LIGHTS; i ++ ) {\n#ifdef PHONG_PER_PIXEL\nvec4 lPosition = viewMatrix * vec4( spotLightPosition[ i ], 1.0 );\nvec3 lVector = lPosition.xyz + vViewPosition.xyz;\nfloat lDistance = 1.0;\nif ( spotLightDistance[ i ] > 0.0 )\nlDistance = 1.0 - min( ( length( lVector ) / spotLightDistance[ i ] ), 1.0 );\nlVector = normalize( lVector );\n#else\nvec3 lVector = normalize( vSpotLight[ i ].xyz );\nfloat lDistance = vSpotLight[ i ].w;\n#endif\nfloat spotEffect = dot( spotLightDirection[ i ], normalize( spotLightPosition[ i ] - vWorldPosition ) );\nif ( spotEffect > spotLightAngle[ i ] ) {\nspotEffect = pow( spotEffect, spotLightExponent[ i ] );\nfloat dotProduct = dot( normal, lVector );\n#ifdef WRAP_AROUND\nfloat spotDiffuseWeightFull = max( dotProduct, 0.0 );\nfloat spotDiffuseWeightHalf = max( 0.5 * dotProduct + 0.5, 0.0 );\nvec3 spotDiffuseWeight = mix( vec3 ( spotDiffuseWeightFull ), vec3( spotDiffuseWeightHalf ), wrapRGB );\n#else\nfloat spotDiffuseWeight = max( dotProduct, 0.0 );\n#endif\nspotDiffuse += diffuse * spotLightColor[ i ] * spotDiffuseWeight * lDistance * spotEffect;\nvec3 spotHalfVector = normalize( lVector + viewPosition );\nfloat spotDotNormalHalf = max( dot( normal, spotHalfVector ), 0.0 );\nfloat spotSpecularWeight = max( pow( spotDotNormalHalf, shininess ), 0.0 );\n#ifdef PHYSICALLY_BASED_SHADING\nfloat specularNormalization = ( shininess + 2.0001 ) / 8.0;\nvec3 schlick = specular + vec3( 1.0 - specular ) * pow( 1.0 - dot( lVector, spotHalfVector ), 5.0 );\nspotSpecular += schlick * spotLightColor[ i ] * spotSpecularWeight * spotDiffuseWeight * lDistance * specularNormalization * spotEffect;\n#else\nspotSpecular += specular * spotLightColor[ i ] * spotSpecularWeight * spotDiffuseWeight * lDistance * spotEffect;\n#endif\n}\n}\n#endif\n#if MAX_DIR_LIGHTS > 0\nvec3 dirDiffuse  = vec3( 0.0 );\nvec3 dirSpecular = vec3( 0.0 );\nfor( int i = 0; i < MAX_DIR_LIGHTS; i ++ ) {\nvec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );\nvec3 dirVector = normalize( lDirection.xyz );\nfloat dotProduct = dot( normal, dirVector );\n#ifdef WRAP_AROUND\nfloat dirDiffuseWeightFull = max( dotProduct, 0.0 );\nfloat dirDiffuseWeightHalf = max( 0.5 * dotProduct + 0.5, 0.0 );\nvec3 dirDiffuseWeight = mix( vec3( dirDiffuseWeightFull ), vec3( dirDiffuseWeightHalf ), wrapRGB );\n#else\nfloat dirDiffuseWeight = max( dotProduct, 0.0 );\n#endif\ndirDiffuse  += diffuse * directionalLightColor[ i ] * dirDiffuseWeight;\nvec3 dirHalfVector = normalize( dirVector + viewPosition );\nfloat dirDotNormalHalf = max( dot( normal, dirHalfVector ), 0.0 );\nfloat dirSpecularWeight = max( pow( dirDotNormalHalf, shininess ), 0.0 );\n#ifdef PHYSICALLY_BASED_SHADING\nfloat specularNormalization = ( shininess + 2.0001 ) / 8.0;\nvec3 schlick = specular + vec3( 1.0 - specular ) * pow( 1.0 - dot( dirVector, dirHalfVector ), 5.0 );\ndirSpecular += schlick * directionalLightColor[ i ] * dirSpecularWeight * dirDiffuseWeight * specularNormalization;\n#else\ndirSpecular += specular * directionalLightColor[ i ] * dirSpecularWeight * dirDiffuseWeight;\n#endif\n}\n#endif\nvec3 totalDiffuse = vec3( 0.0 );\nvec3 totalSpecular = vec3( 0.0 );\n#if MAX_DIR_LIGHTS > 0\ntotalDiffuse += dirDiffuse;\ntotalSpecular += dirSpecular;\n#endif\n#if MAX_POINT_LIGHTS > 0\ntotalDiffuse += pointDiffuse;\ntotalSpecular += pointSpecular;\n#endif\n#if MAX_SPOT_LIGHTS > 0\ntotalDiffuse += spotDiffuse;\ntotalSpecular += spotSpecular;\n#endif\n#ifdef METAL\ngl_FragColor.xyz = gl_FragColor.xyz * ( emissive + totalDiffuse + ambientLightColor * ambient + totalSpecular );\n#else\ngl_FragColor.xyz = gl_FragColor.xyz * ( emissive + totalDiffuse + ambientLightColor * ambient ) + totalSpecular;\n#endif",
color_pars_fragment:"#ifdef USE_COLOR\nvarying vec3 vColor;\n#endif",color_fragment:"#ifdef USE_COLOR\ngl_FragColor = gl_FragColor * vec4( vColor, opacity );\n#endif",color_pars_vertex:"#ifdef USE_COLOR\nvarying vec3 vColor;\n#endif",color_vertex:"#ifdef USE_COLOR\n#ifdef GAMMA_INPUT\nvColor = color * color;\n#else\nvColor = color;\n#endif\n#endif",skinning_pars_vertex:"#ifdef USE_SKINNING\nuniform mat4 boneGlobalMatrices[ MAX_BONES ];\n#endif",skinning_vertex:"#ifdef USE_SKINNING\ngl_Position  = ( boneGlobalMatrices[ int( skinIndex.x ) ] * skinVertexA ) * skinWeight.x;\ngl_Position += ( boneGlobalMatrices[ int( skinIndex.y ) ] * skinVertexB ) * skinWeight.y;\ngl_Position  = projectionMatrix * modelViewMatrix * gl_Position;\n#endif",
morphtarget_pars_vertex:"#ifdef USE_MORPHTARGETS\n#ifndef USE_MORPHNORMALS\nuniform float morphTargetInfluences[ 8 ];\n#else\nuniform float morphTargetInfluences[ 4 ];\n#endif\n#endif",morphtarget_vertex:"#ifdef USE_MORPHTARGETS\nvec3 morphed = vec3( 0.0 );\nmorphed += ( morphTarget0 - position ) * morphTargetInfluences[ 0 ];\nmorphed += ( morphTarget1 - position ) * morphTargetInfluences[ 1 ];\nmorphed += ( morphTarget2 - position ) * morphTargetInfluences[ 2 ];\nmorphed += ( morphTarget3 - position ) * morphTargetInfluences[ 3 ];\n#ifndef USE_MORPHNORMALS\nmorphed += ( morphTarget4 - position ) * morphTargetInfluences[ 4 ];\nmorphed += ( morphTarget5 - position ) * morphTargetInfluences[ 5 ];\nmorphed += ( morphTarget6 - position ) * morphTargetInfluences[ 6 ];\nmorphed += ( morphTarget7 - position ) * morphTargetInfluences[ 7 ];\n#endif\nmorphed += position;\ngl_Position = projectionMatrix * modelViewMatrix * vec4( morphed, 1.0 );\n#endif",
default_vertex:"#ifndef USE_MORPHTARGETS\n#ifndef USE_SKINNING\ngl_Position = projectionMatrix * mvPosition;\n#endif\n#endif",morphnormal_vertex:"#ifdef USE_MORPHNORMALS\nvec3 morphedNormal = vec3( 0.0 );\nmorphedNormal +=  ( morphNormal0 - normal ) * morphTargetInfluences[ 0 ];\nmorphedNormal +=  ( morphNormal1 - normal ) * morphTargetInfluences[ 1 ];\nmorphedNormal +=  ( morphNormal2 - normal ) * morphTargetInfluences[ 2 ];\nmorphedNormal +=  ( morphNormal3 - normal ) * morphTargetInfluences[ 3 ];\nmorphedNormal += normal;\nvec3 transformedNormal = normalMatrix * morphedNormal;\n#else\nvec3 transformedNormal = normalMatrix * normal;\n#endif",
shadowmap_pars_fragment:"#ifdef USE_SHADOWMAP\nuniform sampler2D shadowMap[ MAX_SHADOWS ];\nuniform vec2 shadowMapSize[ MAX_SHADOWS ];\nuniform float shadowDarkness[ MAX_SHADOWS ];\nuniform float shadowBias[ MAX_SHADOWS ];\nvarying vec4 vShadowCoord[ MAX_SHADOWS ];\nfloat unpackDepth( const in vec4 rgba_depth ) {\nconst vec4 bit_shift = vec4( 1.0 / ( 256.0 * 256.0 * 256.0 ), 1.0 / ( 256.0 * 256.0 ), 1.0 / 256.0, 1.0 );\nfloat depth = dot( rgba_depth, bit_shift );\nreturn depth;\n}\n#endif",shadowmap_fragment:"#ifdef USE_SHADOWMAP\n#ifdef SHADOWMAP_DEBUG\nvec3 frustumColors[3];\nfrustumColors[0] = vec3( 1.0, 0.5, 0.0 );\nfrustumColors[1] = vec3( 0.0, 1.0, 0.8 );\nfrustumColors[2] = vec3( 0.0, 0.5, 1.0 );\n#endif\n#ifdef SHADOWMAP_CASCADE\nint inFrustumCount = 0;\n#endif\nfloat fDepth;\nvec3 shadowColor = vec3( 1.0 );\nfor( int i = 0; i < MAX_SHADOWS; i ++ ) {\nvec3 shadowCoord = vShadowCoord[ i ].xyz / vShadowCoord[ i ].w;\nbvec4 inFrustumVec = bvec4 ( shadowCoord.x >= 0.0, shadowCoord.x <= 1.0, shadowCoord.y >= 0.0, shadowCoord.y <= 1.0 );\nbool inFrustum = all( inFrustumVec );\n#ifdef SHADOWMAP_CASCADE\ninFrustumCount += int( inFrustum );\nbvec3 frustumTestVec = bvec3( inFrustum, inFrustumCount == 1, shadowCoord.z <= 1.0 );\n#else\nbvec2 frustumTestVec = bvec2( inFrustum, shadowCoord.z <= 1.0 );\n#endif\nbool frustumTest = all( frustumTestVec );\nif ( frustumTest ) {\nshadowCoord.z += shadowBias[ i ];\n#ifdef SHADOWMAP_SOFT\nfloat shadow = 0.0;\nconst float shadowDelta = 1.0 / 9.0;\nfloat xPixelOffset = 1.0 / shadowMapSize[ i ].x;\nfloat yPixelOffset = 1.0 / shadowMapSize[ i ].y;\nfloat dx0 = -1.25 * xPixelOffset;\nfloat dy0 = -1.25 * yPixelOffset;\nfloat dx1 = 1.25 * xPixelOffset;\nfloat dy1 = 1.25 * yPixelOffset;\nfDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, dy0 ) ) );\nif ( fDepth < shadowCoord.z ) shadow += shadowDelta;\nfDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( 0.0, dy0 ) ) );\nif ( fDepth < shadowCoord.z ) shadow += shadowDelta;\nfDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, dy0 ) ) );\nif ( fDepth < shadowCoord.z ) shadow += shadowDelta;\nfDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, 0.0 ) ) );\nif ( fDepth < shadowCoord.z ) shadow += shadowDelta;\nfDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy ) );\nif ( fDepth < shadowCoord.z ) shadow += shadowDelta;\nfDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, 0.0 ) ) );\nif ( fDepth < shadowCoord.z ) shadow += shadowDelta;\nfDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, dy1 ) ) );\nif ( fDepth < shadowCoord.z ) shadow += shadowDelta;\nfDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( 0.0, dy1 ) ) );\nif ( fDepth < shadowCoord.z ) shadow += shadowDelta;\nfDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, dy1 ) ) );\nif ( fDepth < shadowCoord.z ) shadow += shadowDelta;\nshadowColor = shadowColor * vec3( ( 1.0 - shadowDarkness[ i ] * shadow ) );\n#else\nvec4 rgbaDepth = texture2D( shadowMap[ i ], shadowCoord.xy );\nfloat fDepth = unpackDepth( rgbaDepth );\nif ( fDepth < shadowCoord.z )\nshadowColor = shadowColor * vec3( 1.0 - shadowDarkness[ i ] );\n#endif\n}\n#ifdef SHADOWMAP_DEBUG\n#ifdef SHADOWMAP_CASCADE\nif ( inFrustum && inFrustumCount == 1 ) gl_FragColor.xyz *= frustumColors[ i ];\n#else\nif ( inFrustum ) gl_FragColor.xyz *= frustumColors[ i ];\n#endif\n#endif\n}\n#ifdef GAMMA_OUTPUT\nshadowColor *= shadowColor;\n#endif\ngl_FragColor.xyz = gl_FragColor.xyz * shadowColor;\n#endif",
shadowmap_pars_vertex:"#ifdef USE_SHADOWMAP\nvarying vec4 vShadowCoord[ MAX_SHADOWS ];\nuniform mat4 shadowMatrix[ MAX_SHADOWS ];\n#endif",shadowmap_vertex:"#ifdef USE_SHADOWMAP\nfor( int i = 0; i < MAX_SHADOWS; i ++ ) {\n#ifdef USE_MORPHTARGETS\nvShadowCoord[ i ] = shadowMatrix[ i ] * objectMatrix * vec4( morphed, 1.0 );\n#else\nvShadowCoord[ i ] = shadowMatrix[ i ] * objectMatrix * vec4( position, 1.0 );\n#endif\n}\n#endif",alphatest_fragment:"#ifdef ALPHATEST\nif ( gl_FragColor.a < ALPHATEST ) discard;\n#endif",
linear_to_gamma_fragment:"#ifdef GAMMA_OUTPUT\ngl_FragColor.xyz = sqrt( gl_FragColor.xyz );\n#endif"};
THREE.UniformsUtils={merge:function(a){var b,c,d,e={};for(b=0;b<a.length;b++){d=this.clone(a[b]);for(c in d)e[c]=d[c]}return e},clone:function(a){var b,c,d,e={};for(b in a){e[b]={};for(c in a[b]){d=a[b][c];e[b][c]=d instanceof THREE.Color||d instanceof THREE.Vector2||d instanceof THREE.Vector3||d instanceof THREE.Vector4||d instanceof THREE.Matrix4||d instanceof THREE.Texture?d.clone():d instanceof Array?d.slice():d}}return e}};
THREE.UniformsLib={common:{diffuse:{type:"c",value:new THREE.Color(15658734)},opacity:{type:"f",value:1},map:{type:"t",value:0,texture:null},offsetRepeat:{type:"v4",value:new THREE.Vector4(0,0,1,1)},lightMap:{type:"t",value:2,texture:null},envMap:{type:"t",value:1,texture:null},flipEnvMap:{type:"f",value:-1},useRefract:{type:"i",value:0},reflectivity:{type:"f",value:1},refractionRatio:{type:"f",value:0.98},combine:{type:"i",value:0},morphTargetInfluences:{type:"f",value:0}},fog:{fogDensity:{type:"f",
value:2.5E-4},fogNear:{type:"f",value:1},fogFar:{type:"f",value:2E3},fogColor:{type:"c",value:new THREE.Color(16777215)}},lights:{ambientLightColor:{type:"fv",value:[]},directionalLightDirection:{type:"fv",value:[]},directionalLightColor:{type:"fv",value:[]},pointLightColor:{type:"fv",value:[]},pointLightPosition:{type:"fv",value:[]},pointLightDistance:{type:"fv1",value:[]},spotLightColor:{type:"fv",value:[]},spotLightPosition:{type:"fv",value:[]},spotLightDirection:{type:"fv",value:[]},spotLightDistance:{type:"fv1",
value:[]},spotLightAngle:{type:"fv1",value:[]},spotLightExponent:{type:"fv1",value:[]}},particle:{psColor:{type:"c",value:new THREE.Color(15658734)},opacity:{type:"f",value:1},size:{type:"f",value:1},scale:{type:"f",value:1},map:{type:"t",value:0,texture:null},fogDensity:{type:"f",value:2.5E-4},fogNear:{type:"f",value:1},fogFar:{type:"f",value:2E3},fogColor:{type:"c",value:new THREE.Color(16777215)}},shadowmap:{shadowMap:{type:"tv",value:6,texture:[]},shadowMapSize:{type:"v2v",value:[]},shadowBias:{type:"fv1",
value:[]},shadowDarkness:{type:"fv1",value:[]},shadowMatrix:{type:"m4v",value:[]}}};
THREE.ShaderLib={depth:{uniforms:{mNear:{type:"f",value:1},mFar:{type:"f",value:2E3},opacity:{type:"f",value:1}},vertexShader:"void main() {\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",fragmentShader:"uniform float mNear;\nuniform float mFar;\nuniform float opacity;\nvoid main() {\nfloat depth = gl_FragCoord.z / gl_FragCoord.w;\nfloat color = 1.0 - smoothstep( mNear, mFar, depth );\ngl_FragColor = vec4( vec3( color ), opacity );\n}"},normal:{uniforms:{opacity:{type:"f",
value:1}},vertexShader:"varying vec3 vNormal;\nvoid main() {\nvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\nvNormal = normalMatrix * normal;\ngl_Position = projectionMatrix * mvPosition;\n}",fragmentShader:"uniform float opacity;\nvarying vec3 vNormal;\nvoid main() {\ngl_FragColor = vec4( 0.5 * normalize( vNormal ) + 0.5, opacity );\n}"},basic:{uniforms:THREE.UniformsUtils.merge([THREE.UniformsLib.common,THREE.UniformsLib.fog,THREE.UniformsLib.shadowmap]),vertexShader:[THREE.ShaderChunk.map_pars_vertex,
THREE.ShaderChunk.lightmap_pars_vertex,THREE.ShaderChunk.envmap_pars_vertex,THREE.ShaderChunk.color_pars_vertex,THREE.ShaderChunk.skinning_pars_vertex,THREE.ShaderChunk.morphtarget_pars_vertex,THREE.ShaderChunk.shadowmap_pars_vertex,"void main() {\nvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",THREE.ShaderChunk.map_vertex,THREE.ShaderChunk.lightmap_vertex,THREE.ShaderChunk.envmap_vertex,THREE.ShaderChunk.color_vertex,THREE.ShaderChunk.skinning_vertex,THREE.ShaderChunk.morphtarget_vertex,
THREE.ShaderChunk.default_vertex,THREE.ShaderChunk.shadowmap_vertex,"}"].join("\n"),fragmentShader:["uniform vec3 diffuse;\nuniform float opacity;",THREE.ShaderChunk.color_pars_fragment,THREE.ShaderChunk.map_pars_fragment,THREE.ShaderChunk.lightmap_pars_fragment,THREE.ShaderChunk.envmap_pars_fragment,THREE.ShaderChunk.fog_pars_fragment,THREE.ShaderChunk.shadowmap_pars_fragment,"void main() {\ngl_FragColor = vec4( diffuse, opacity );",THREE.ShaderChunk.map_fragment,THREE.ShaderChunk.alphatest_fragment,
THREE.ShaderChunk.lightmap_fragment,THREE.ShaderChunk.color_fragment,THREE.ShaderChunk.envmap_fragment,THREE.ShaderChunk.shadowmap_fragment,THREE.ShaderChunk.linear_to_gamma_fragment,THREE.ShaderChunk.fog_fragment,"}"].join("\n")},lambert:{uniforms:THREE.UniformsUtils.merge([THREE.UniformsLib.common,THREE.UniformsLib.fog,THREE.UniformsLib.lights,THREE.UniformsLib.shadowmap,{ambient:{type:"c",value:new THREE.Color(16777215)},emissive:{type:"c",value:new THREE.Color(0)},wrapRGB:{type:"v3",value:new THREE.Vector3(1,
1,1)}}]),vertexShader:["varying vec3 vLightFront;\n#ifdef DOUBLE_SIDED\nvarying vec3 vLightBack;\n#endif",THREE.ShaderChunk.map_pars_vertex,THREE.ShaderChunk.lightmap_pars_vertex,THREE.ShaderChunk.envmap_pars_vertex,THREE.ShaderChunk.lights_lambert_pars_vertex,THREE.ShaderChunk.color_pars_vertex,THREE.ShaderChunk.skinning_pars_vertex,THREE.ShaderChunk.morphtarget_pars_vertex,THREE.ShaderChunk.shadowmap_pars_vertex,"void main() {\nvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",THREE.ShaderChunk.map_vertex,
THREE.ShaderChunk.lightmap_vertex,THREE.ShaderChunk.envmap_vertex,THREE.ShaderChunk.color_vertex,THREE.ShaderChunk.morphnormal_vertex,"#ifndef USE_ENVMAP\nvec4 mPosition = objectMatrix * vec4( position, 1.0 );\n#endif",THREE.ShaderChunk.lights_lambert_vertex,THREE.ShaderChunk.skinning_vertex,THREE.ShaderChunk.morphtarget_vertex,THREE.ShaderChunk.default_vertex,THREE.ShaderChunk.shadowmap_vertex,"}"].join("\n"),fragmentShader:["uniform float opacity;\nvarying vec3 vLightFront;\n#ifdef DOUBLE_SIDED\nvarying vec3 vLightBack;\n#endif",
THREE.ShaderChunk.color_pars_fragment,THREE.ShaderChunk.map_pars_fragment,THREE.ShaderChunk.lightmap_pars_fragment,THREE.ShaderChunk.envmap_pars_fragment,THREE.ShaderChunk.fog_pars_fragment,THREE.ShaderChunk.shadowmap_pars_fragment,"void main() {\ngl_FragColor = vec4( vec3 ( 1.0 ), opacity );",THREE.ShaderChunk.map_fragment,THREE.ShaderChunk.alphatest_fragment,"#ifdef DOUBLE_SIDED\nif ( gl_FrontFacing )\ngl_FragColor.xyz *= vLightFront;\nelse\ngl_FragColor.xyz *= vLightBack;\n#else\ngl_FragColor.xyz *= vLightFront;\n#endif",
THREE.ShaderChunk.lightmap_fragment,THREE.ShaderChunk.color_fragment,THREE.ShaderChunk.envmap_fragment,THREE.ShaderChunk.shadowmap_fragment,THREE.ShaderChunk.linear_to_gamma_fragment,THREE.ShaderChunk.fog_fragment,"}"].join("\n")},phong:{uniforms:THREE.UniformsUtils.merge([THREE.UniformsLib.common,THREE.UniformsLib.fog,THREE.UniformsLib.lights,THREE.UniformsLib.shadowmap,{ambient:{type:"c",value:new THREE.Color(16777215)},emissive:{type:"c",value:new THREE.Color(0)},specular:{type:"c",value:new THREE.Color(1118481)},
shininess:{type:"f",value:30},wrapRGB:{type:"v3",value:new THREE.Vector3(1,1,1)}}]),vertexShader:["varying vec3 vViewPosition;\nvarying vec3 vNormal;",THREE.ShaderChunk.map_pars_vertex,THREE.ShaderChunk.lightmap_pars_vertex,THREE.ShaderChunk.envmap_pars_vertex,THREE.ShaderChunk.lights_phong_pars_vertex,THREE.ShaderChunk.color_pars_vertex,THREE.ShaderChunk.skinning_pars_vertex,THREE.ShaderChunk.morphtarget_pars_vertex,THREE.ShaderChunk.shadowmap_pars_vertex,"void main() {\nvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
THREE.ShaderChunk.map_vertex,THREE.ShaderChunk.lightmap_vertex,THREE.ShaderChunk.envmap_vertex,THREE.ShaderChunk.color_vertex,"#ifndef USE_ENVMAP\nvec4 mPosition = objectMatrix * vec4( position, 1.0 );\n#endif\nvViewPosition = -mvPosition.xyz;",THREE.ShaderChunk.morphnormal_vertex,"vNormal = transformedNormal;",THREE.ShaderChunk.lights_phong_vertex,THREE.ShaderChunk.skinning_vertex,THREE.ShaderChunk.morphtarget_vertex,THREE.ShaderChunk.default_vertex,THREE.ShaderChunk.shadowmap_vertex,"}"].join("\n"),
fragmentShader:["uniform vec3 diffuse;\nuniform float opacity;\nuniform vec3 ambient;\nuniform vec3 emissive;\nuniform vec3 specular;\nuniform float shininess;",THREE.ShaderChunk.color_pars_fragment,THREE.ShaderChunk.map_pars_fragment,THREE.ShaderChunk.lightmap_pars_fragment,THREE.ShaderChunk.envmap_pars_fragment,THREE.ShaderChunk.fog_pars_fragment,THREE.ShaderChunk.lights_phong_pars_fragment,THREE.ShaderChunk.shadowmap_pars_fragment,"void main() {\ngl_FragColor = vec4( vec3 ( 1.0 ), opacity );",
THREE.ShaderChunk.map_fragment,THREE.ShaderChunk.alphatest_fragment,THREE.ShaderChunk.lights_phong_fragment,THREE.ShaderChunk.lightmap_fragment,THREE.ShaderChunk.color_fragment,THREE.ShaderChunk.envmap_fragment,THREE.ShaderChunk.shadowmap_fragment,THREE.ShaderChunk.linear_to_gamma_fragment,THREE.ShaderChunk.fog_fragment,"}"].join("\n")},particle_basic:{uniforms:THREE.UniformsUtils.merge([THREE.UniformsLib.particle,THREE.UniformsLib.shadowmap]),vertexShader:["uniform float size;\nuniform float scale;",
THREE.ShaderChunk.color_pars_vertex,THREE.ShaderChunk.shadowmap_pars_vertex,"void main() {",THREE.ShaderChunk.color_vertex,"vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n#ifdef USE_SIZEATTENUATION\ngl_PointSize = size * ( scale / length( mvPosition.xyz ) );\n#else\ngl_PointSize = size;\n#endif\ngl_Position = projectionMatrix * mvPosition;",THREE.ShaderChunk.shadowmap_vertex,"}"].join("\n"),fragmentShader:["uniform vec3 psColor;\nuniform float opacity;",THREE.ShaderChunk.color_pars_fragment,
THREE.ShaderChunk.map_particle_pars_fragment,THREE.ShaderChunk.fog_pars_fragment,THREE.ShaderChunk.shadowmap_pars_fragment,"void main() {\ngl_FragColor = vec4( psColor, opacity );",THREE.ShaderChunk.map_particle_fragment,THREE.ShaderChunk.alphatest_fragment,THREE.ShaderChunk.color_fragment,THREE.ShaderChunk.shadowmap_fragment,THREE.ShaderChunk.fog_fragment,"}"].join("\n")},depthRGBA:{uniforms:{},vertexShader:[THREE.ShaderChunk.morphtarget_pars_vertex,"void main() {\nvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
THREE.ShaderChunk.morphtarget_vertex,THREE.ShaderChunk.default_vertex,"}"].join("\n"),fragmentShader:"vec4 pack_depth( const in float depth ) {\nconst vec4 bit_shift = vec4( 256.0 * 256.0 * 256.0, 256.0 * 256.0, 256.0, 1.0 );\nconst vec4 bit_mask  = vec4( 0.0, 1.0 / 256.0, 1.0 / 256.0, 1.0 / 256.0 );\nvec4 res = fract( depth * bit_shift );\nres -= res.xxyz * bit_mask;\nreturn res;\n}\nvoid main() {\ngl_FragData[ 0 ] = pack_depth( gl_FragCoord.z );\n}"}};
THREE.WebGLRenderer=function(a){function b(a,b){var c=a.vertices.length,d=b.material;if(d.attributes){if(a.__webglCustomAttributesList===void 0)a.__webglCustomAttributesList=[];for(var e in d.attributes){var f=d.attributes[e];if(!f.__webglInitialized||f.createUniqueBuffers){f.__webglInitialized=true;var g=1;f.type==="v2"?g=2:f.type==="v3"?g=3:f.type==="v4"?g=4:f.type==="c"&&(g=3);f.size=g;f.array=new Float32Array(c*g);f.buffer=i.createBuffer();f.buffer.belongsToAttribute=e;f.needsUpdate=true}a.__webglCustomAttributesList.push(f)}}}
function c(a,b){if(a.material&&!(a.material instanceof THREE.MeshFaceMaterial))return a.material;if(b.materialIndex>=0)return a.geometry.materials[b.materialIndex]}function d(a){return a instanceof THREE.MeshBasicMaterial&&!a.envMap||a instanceof THREE.MeshDepthMaterial?false:a&&a.shading!==void 0&&a.shading===THREE.SmoothShading?THREE.SmoothShading:THREE.FlatShading}function e(a){return a.map||a.lightMap||a instanceof THREE.ShaderMaterial?true:false}function f(a,b,c){var d,e,f,g,h=a.vertices;g=h.length;
var j=a.colors,k=j.length,l=a.__vertexArray,m=a.__colorArray,n=a.__sortArray,o=a.verticesNeedUpdate,p=a.colorsNeedUpdate,r=a.__webglCustomAttributesList;if(c.sortParticles){wa.copy(gb);wa.multiplySelf(c.matrixWorld);for(d=0;d<g;d++){e=h[d];Pa.copy(e);wa.multiplyVector3(Pa);n[d]=[Pa.z,d]}n.sort(function(a,b){return b[0]-a[0]});for(d=0;d<g;d++){e=h[n[d][1]];f=d*3;l[f]=e.x;l[f+1]=e.y;l[f+2]=e.z}for(d=0;d<k;d++){f=d*3;e=j[n[d][1]];m[f]=e.r;m[f+1]=e.g;m[f+2]=e.b}if(r){j=0;for(k=r.length;j<k;j++){h=r[j];
if(h.boundTo===void 0||h.boundTo==="vertices"){f=0;e=h.value.length;if(h.size===1)for(d=0;d<e;d++){g=n[d][1];h.array[d]=h.value[g]}else if(h.size===2)for(d=0;d<e;d++){g=n[d][1];g=h.value[g];h.array[f]=g.x;h.array[f+1]=g.y;f=f+2}else if(h.size===3)if(h.type==="c")for(d=0;d<e;d++){g=n[d][1];g=h.value[g];h.array[f]=g.r;h.array[f+1]=g.g;h.array[f+2]=g.b;f=f+3}else for(d=0;d<e;d++){g=n[d][1];g=h.value[g];h.array[f]=g.x;h.array[f+1]=g.y;h.array[f+2]=g.z;f=f+3}else if(h.size===4)for(d=0;d<e;d++){g=n[d][1];
g=h.value[g];h.array[f]=g.x;h.array[f+1]=g.y;h.array[f+2]=g.z;h.array[f+3]=g.w;f=f+4}}}}}else{if(o)for(d=0;d<g;d++){e=h[d];f=d*3;l[f]=e.x;l[f+1]=e.y;l[f+2]=e.z}if(p)for(d=0;d<k;d++){e=j[d];f=d*3;m[f]=e.r;m[f+1]=e.g;m[f+2]=e.b}if(r){j=0;for(k=r.length;j<k;j++){h=r[j];if(h.needsUpdate&&(h.boundTo===void 0||h.boundTo==="vertices")){e=h.value.length;f=0;if(h.size===1)for(d=0;d<e;d++)h.array[d]=h.value[d];else if(h.size===2)for(d=0;d<e;d++){g=h.value[d];h.array[f]=g.x;h.array[f+1]=g.y;f=f+2}else if(h.size===
3)if(h.type==="c")for(d=0;d<e;d++){g=h.value[d];h.array[f]=g.r;h.array[f+1]=g.g;h.array[f+2]=g.b;f=f+3}else for(d=0;d<e;d++){g=h.value[d];h.array[f]=g.x;h.array[f+1]=g.y;h.array[f+2]=g.z;f=f+3}else if(h.size===4)for(d=0;d<e;d++){g=h.value[d];h.array[f]=g.x;h.array[f+1]=g.y;h.array[f+2]=g.z;h.array[f+3]=g.w;f=f+4}}}}}if(o||c.sortParticles){i.bindBuffer(i.ARRAY_BUFFER,a.__webglVertexBuffer);i.bufferData(i.ARRAY_BUFFER,l,b)}if(p||c.sortParticles){i.bindBuffer(i.ARRAY_BUFFER,a.__webglColorBuffer);i.bufferData(i.ARRAY_BUFFER,
m,b)}if(r){j=0;for(k=r.length;j<k;j++){h=r[j];if(h.needsUpdate||c.sortParticles){i.bindBuffer(i.ARRAY_BUFFER,h.buffer);i.bufferData(i.ARRAY_BUFFER,h.array,b)}}}}function g(a,b){return b.z-a.z}function h(a,b){return b[1]-a[1]}function j(a,b,c){if(a.length)for(var d=0,e=a.length;d<e;d++){fa=S=null;N=ca=U=$=oa=Oa=Y=-1;la=true;a[d].render(b,c,ab,Ba);fa=S=null;N=ca=U=$=oa=Oa=Y=-1;la=true}}function k(a,b,c,d,e,f,g,h){var i,j,k,l;if(b){j=a.length-1;l=b=-1}else{j=0;b=a.length;l=1}for(var m=j;m!==b;m=m+l){i=
a[m];if(i.render){j=i.object;k=i.buffer;if(h)i=h;else{i=i[c];if(!i)continue;g&&C.setBlending(i.blending,i.blendEquation,i.blendSrc,i.blendDst);C.setDepthTest(i.depthTest);C.setDepthWrite(i.depthWrite);t(i.polygonOffset,i.polygonOffsetFactor,i.polygonOffsetUnits)}C.setObjectFaces(j);k instanceof THREE.BufferGeometry?C.renderBufferDirect(d,e,f,i,k,j):C.renderBuffer(d,e,f,i,k,j)}}}function l(a,b,c,d,e,f,g){for(var h,i,j=0,k=a.length;j<k;j++){h=a[j];i=h.object;if(i.visible){if(g)h=g;else{h=h[b];if(!h)continue;
f&&C.setBlending(h.blending,h.blendEquation,h.blendSrc,h.blendDst);C.setDepthTest(h.depthTest);C.setDepthWrite(h.depthWrite);t(h.polygonOffset,h.polygonOffsetFactor,h.polygonOffsetUnits)}C.renderImmediateObject(c,d,e,h,i)}}}function o(a,b,c){a.push({buffer:b,object:c,opaque:null,transparent:null})}function m(a){for(var b in a.attributes)if(a.attributes[b].needsUpdate)return true;return false}function p(a){for(var b in a.attributes)a.attributes[b].needsUpdate=false}function r(a,b){for(var c=a.length-
1;c>=0;c--)a[c].object===b&&a.splice(c,1)}function n(a,b){for(var c=a.length-1;c>=0;c--)a[c]===b&&a.splice(c,1)}function q(a,b,c,d,e){if(d.needsUpdate){d.program&&C.deallocateMaterial(d);C.initMaterial(d,b,c,e);d.needsUpdate=false}if(d.morphTargets&&!e.__webglMorphTargetInfluences)e.__webglMorphTargetInfluences=new Float32Array(C.maxMorphTargets);var f=false,g=d.program,h=g.uniforms,j=d.uniforms;if(g!==S){i.useProgram(g);S=g;f=true}if(d.id!==N){N=d.id;f=true}if(f||a!==fa){i.uniformMatrix4fv(h.projectionMatrix,
false,a._projectionMatrixArray);a!==fa&&(fa=a)}if(f){if(c&&d.fog){j.fogColor.value=c.color;if(c instanceof THREE.Fog){j.fogNear.value=c.near;j.fogFar.value=c.far}else if(c instanceof THREE.FogExp2)j.fogDensity.value=c.density}if(d instanceof THREE.MeshPhongMaterial||d instanceof THREE.MeshLambertMaterial||d.lights){if(la){for(var k,l=0,m=0,n=0,o,p,r,q=ob,t=q.directional.colors,v=q.directional.positions,u=q.point.colors,x=q.point.positions,y=q.point.distances,B=q.spot.colors,H=q.spot.positions,E=q.spot.distances,
$=q.spot.directions,I=q.spot.angles,G=q.spot.exponents,M=0,L=0,Y=0,O=r=0,c=O=0,f=b.length;c<f;c++){k=b[c];if(!k.onlyShadow){o=k.color;p=k.intensity;r=k.distance;if(k instanceof THREE.AmbientLight)if(C.gammaInput){l=l+o.r*o.r;m=m+o.g*o.g;n=n+o.b*o.b}else{l=l+o.r;m=m+o.g;n=n+o.b}else if(k instanceof THREE.DirectionalLight){r=M*3;if(C.gammaInput){t[r]=o.r*o.r*p*p;t[r+1]=o.g*o.g*p*p;t[r+2]=o.b*o.b*p*p}else{t[r]=o.r*p;t[r+1]=o.g*p;t[r+2]=o.b*p}Da.copy(k.matrixWorld.getPosition());Da.subSelf(k.target.matrixWorld.getPosition());
Da.normalize();v[r]=Da.x;v[r+1]=Da.y;v[r+2]=Da.z;M=M+1}else if(k instanceof THREE.PointLight){O=L*3;if(C.gammaInput){u[O]=o.r*o.r*p*p;u[O+1]=o.g*o.g*p*p;u[O+2]=o.b*o.b*p*p}else{u[O]=o.r*p;u[O+1]=o.g*p;u[O+2]=o.b*p}o=k.matrixWorld.getPosition();x[O]=o.x;x[O+1]=o.y;x[O+2]=o.z;y[L]=r;L=L+1}else if(k instanceof THREE.SpotLight){O=Y*3;if(C.gammaInput){B[O]=o.r*o.r*p*p;B[O+1]=o.g*o.g*p*p;B[O+2]=o.b*o.b*p*p}else{B[O]=o.r*p;B[O+1]=o.g*p;B[O+2]=o.b*p}o=k.matrixWorld.getPosition();H[O]=o.x;H[O+1]=o.y;H[O+2]=
o.z;E[Y]=r;Da.copy(o);Da.subSelf(k.target.matrixWorld.getPosition());Da.normalize();$[O]=Da.x;$[O+1]=Da.y;$[O+2]=Da.z;I[Y]=Math.cos(k.angle);G[Y]=k.exponent;Y=Y+1}}}c=M*3;for(f=t.length;c<f;c++)t[c]=0;c=L*3;for(f=u.length;c<f;c++)u[c]=0;c=Y*3;for(f=B.length;c<f;c++)B[c]=0;q.directional.length=M;q.point.length=L;q.spot.length=Y;q.ambient[0]=l;q.ambient[1]=m;q.ambient[2]=n;la=false}c=ob;j.ambientLightColor.value=c.ambient;j.directionalLightColor.value=c.directional.colors;j.directionalLightDirection.value=
c.directional.positions;j.pointLightColor.value=c.point.colors;j.pointLightPosition.value=c.point.positions;j.pointLightDistance.value=c.point.distances;j.spotLightColor.value=c.spot.colors;j.spotLightPosition.value=c.spot.positions;j.spotLightDistance.value=c.spot.distances;j.spotLightDirection.value=c.spot.directions;j.spotLightAngle.value=c.spot.angles;j.spotLightExponent.value=c.spot.exponents}if(d instanceof THREE.MeshBasicMaterial||d instanceof THREE.MeshLambertMaterial||d instanceof THREE.MeshPhongMaterial){j.opacity.value=
d.opacity;C.gammaInput?j.diffuse.value.copyGammaToLinear(d.color):j.diffuse.value=d.color;(j.map.texture=d.map)&&j.offsetRepeat.value.set(d.map.offset.x,d.map.offset.y,d.map.repeat.x,d.map.repeat.y);j.lightMap.texture=d.lightMap;j.envMap.texture=d.envMap;j.flipEnvMap.value=d.envMap instanceof THREE.WebGLRenderTargetCube?1:-1;j.reflectivity.value=d.reflectivity;j.refractionRatio.value=d.refractionRatio;j.combine.value=d.combine;j.useRefract.value=d.envMap&&d.envMap.mapping instanceof THREE.CubeRefractionMapping}if(d instanceof
THREE.LineBasicMaterial){j.diffuse.value=d.color;j.opacity.value=d.opacity}else if(d instanceof THREE.ParticleBasicMaterial){j.psColor.value=d.color;j.opacity.value=d.opacity;j.size.value=d.size;j.scale.value=A.height/2;j.map.texture=d.map}else if(d instanceof THREE.MeshPhongMaterial){j.shininess.value=d.shininess;if(C.gammaInput){j.ambient.value.copyGammaToLinear(d.ambient);j.emissive.value.copyGammaToLinear(d.emissive);j.specular.value.copyGammaToLinear(d.specular)}else{j.ambient.value=d.ambient;
j.emissive.value=d.emissive;j.specular.value=d.specular}d.wrapAround&&j.wrapRGB.value.copy(d.wrapRGB)}else if(d instanceof THREE.MeshLambertMaterial){if(C.gammaInput){j.ambient.value.copyGammaToLinear(d.ambient);j.emissive.value.copyGammaToLinear(d.emissive)}else{j.ambient.value=d.ambient;j.emissive.value=d.emissive}d.wrapAround&&j.wrapRGB.value.copy(d.wrapRGB)}else if(d instanceof THREE.MeshDepthMaterial){j.mNear.value=a.near;j.mFar.value=a.far;j.opacity.value=d.opacity}else if(d instanceof THREE.MeshNormalMaterial)j.opacity.value=
d.opacity;if(e.receiveShadow&&!d._shadowPass&&j.shadowMatrix){f=c=0;for(k=b.length;f<k;f++){l=b[f];if(l.castShadow&&(l instanceof THREE.SpotLight||l instanceof THREE.DirectionalLight&&!l.shadowCascade)){j.shadowMap.texture[c]=l.shadowMap;j.shadowMapSize.value[c]=l.shadowMapSize;j.shadowMatrix.value[c]=l.shadowMatrix;j.shadowDarkness.value[c]=l.shadowDarkness;j.shadowBias.value[c]=l.shadowBias;c++}}}b=d.uniformsList;j=0;for(c=b.length;j<c;j++)if(l=g.uniforms[b[j][1]]){f=b[j][0];m=f.type;k=f.value;
switch(m){case "i":i.uniform1i(l,k);break;case "f":i.uniform1f(l,k);break;case "v2":i.uniform2f(l,k.x,k.y);break;case "v3":i.uniform3f(l,k.x,k.y,k.z);break;case "v4":i.uniform4f(l,k.x,k.y,k.z,k.w);break;case "c":i.uniform3f(l,k.r,k.g,k.b);break;case "fv1":i.uniform1fv(l,k);break;case "fv":i.uniform3fv(l,k);break;case "v2v":if(!f._array)f._array=new Float32Array(2*k.length);m=0;for(n=k.length;m<n;m++){q=m*2;f._array[q]=k[m].x;f._array[q+1]=k[m].y}i.uniform2fv(l,f._array);break;case "v3v":if(!f._array)f._array=
new Float32Array(3*k.length);m=0;for(n=k.length;m<n;m++){q=m*3;f._array[q]=k[m].x;f._array[q+1]=k[m].y;f._array[q+2]=k[m].z}i.uniform3fv(l,f._array);break;case "v4v":if(!f._array)f._array=new Float32Array(4*k.length);m=0;for(n=k.length;m<n;m++){q=m*4;f._array[q]=k[m].x;f._array[q+1]=k[m].y;f._array[q+2]=k[m].z;f._array[q+3]=k[m].w}i.uniform4fv(l,f._array);break;case "m4":if(!f._array)f._array=new Float32Array(16);k.flattenToArray(f._array);i.uniformMatrix4fv(l,false,f._array);break;case "m4v":if(!f._array)f._array=
new Float32Array(16*k.length);m=0;for(n=k.length;m<n;m++)k[m].flattenToArrayOffset(f._array,m*16);i.uniformMatrix4fv(l,false,f._array);break;case "t":i.uniform1i(l,k);l=f.texture;if(!l)continue;if(l.image instanceof Array&&l.image.length===6){f=l;if(f.image.length===6)if(f.needsUpdate){if(!f.image.__webglTextureCube)f.image.__webglTextureCube=i.createTexture();i.activeTexture(i.TEXTURE0+k);i.bindTexture(i.TEXTURE_CUBE_MAP,f.image.__webglTextureCube);k=[];for(l=0;l<6;l++){m=k;n=l;if(C.autoScaleCubemaps){q=
f.image[l];v=ac;if(!(q.width<=v&&q.height<=v)){u=Math.max(q.width,q.height);t=Math.floor(q.width*v/u);v=Math.floor(q.height*v/u);u=document.createElement("canvas");u.width=t;u.height=v;u.getContext("2d").drawImage(q,0,0,q.width,q.height,0,0,t,v);q=u}}else q=f.image[l];m[n]=q}l=k[0];m=(l.width&l.width-1)===0&&(l.height&l.height-1)===0;n=D(f.format);q=D(f.type);s(i.TEXTURE_CUBE_MAP,f,m);for(l=0;l<6;l++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+l,0,n,n,q,k[l]);f.generateMipmaps&&m&&i.generateMipmap(i.TEXTURE_CUBE_MAP);
f.needsUpdate=false;if(f.onUpdate)f.onUpdate()}else{i.activeTexture(i.TEXTURE0+k);i.bindTexture(i.TEXTURE_CUBE_MAP,f.image.__webglTextureCube)}}else if(l instanceof THREE.WebGLRenderTargetCube){f=l;i.activeTexture(i.TEXTURE0+k);i.bindTexture(i.TEXTURE_CUBE_MAP,f.__webglTexture)}else C.setTexture(l,k);break;case "tv":if(!f._array){f._array=[];m=0;for(n=f.texture.length;m<n;m++)f._array[m]=k+m}i.uniform1iv(l,f._array);m=0;for(n=f.texture.length;m<n;m++)(l=f.texture[m])&&C.setTexture(l,f._array[m])}}if((d instanceof
THREE.ShaderMaterial||d instanceof THREE.MeshPhongMaterial||d.envMap)&&h.cameraPosition!==null){b=a.matrixWorld.getPosition();i.uniform3f(h.cameraPosition,b.x,b.y,b.z)}(d instanceof THREE.MeshPhongMaterial||d instanceof THREE.MeshLambertMaterial||d instanceof THREE.ShaderMaterial||d.skinning)&&h.viewMatrix!==null&&i.uniformMatrix4fv(h.viewMatrix,false,a._viewMatrixArray);d.skinning&&i.uniformMatrix4fv(h.boneGlobalMatrices,false,e.boneMatrices)}i.uniformMatrix4fv(h.modelViewMatrix,false,e._modelViewMatrix.elements);
h.normalMatrix&&i.uniformMatrix3fv(h.normalMatrix,false,e._normalMatrix.elements);h.objectMatrix!==null&&i.uniformMatrix4fv(h.objectMatrix,false,e.matrixWorld.elements);return g}function u(a,b){a._modelViewMatrix.multiply(b.matrixWorldInverse,a.matrixWorld);a._normalMatrix.getInverse(a._modelViewMatrix);a._normalMatrix.transpose()}function t(a,b,c){if(Ta!==a){a?i.enable(i.POLYGON_OFFSET_FILL):i.disable(i.POLYGON_OFFSET_FILL);Ta=a}if(a&&(eb!==b||fb!==c)){i.polygonOffset(b,c);eb=b;fb=c}}function y(a,
b){var c;a==="fragment"?c=i.createShader(i.FRAGMENT_SHADER):a==="vertex"&&(c=i.createShader(i.VERTEX_SHADER));i.shaderSource(c,b);i.compileShader(c);if(!i.getShaderParameter(c,i.COMPILE_STATUS)){console.error(i.getShaderInfoLog(c));console.error(b);return null}return c}function s(a,b,c){if(c){i.texParameteri(a,i.TEXTURE_WRAP_S,D(b.wrapS));i.texParameteri(a,i.TEXTURE_WRAP_T,D(b.wrapT));i.texParameteri(a,i.TEXTURE_MAG_FILTER,D(b.magFilter));i.texParameteri(a,i.TEXTURE_MIN_FILTER,D(b.minFilter))}else{i.texParameteri(a,
i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE);i.texParameteri(a,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE);i.texParameteri(a,i.TEXTURE_MAG_FILTER,E(b.magFilter));i.texParameteri(a,i.TEXTURE_MIN_FILTER,E(b.minFilter))}}function x(a,b){i.bindRenderbuffer(i.RENDERBUFFER,a);if(b.depthBuffer&&!b.stencilBuffer){i.renderbufferStorage(i.RENDERBUFFER,i.DEPTH_COMPONENT16,b.width,b.height);i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.RENDERBUFFER,a)}else if(b.depthBuffer&&b.stencilBuffer){i.renderbufferStorage(i.RENDERBUFFER,
i.DEPTH_STENCIL,b.width,b.height);i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.RENDERBUFFER,a)}else i.renderbufferStorage(i.RENDERBUFFER,i.RGBA4,b.width,b.height)}function E(a){switch(a){case THREE.NearestFilter:case THREE.NearestMipMapNearestFilter:case THREE.NearestMipMapLinearFilter:return i.NEAREST;default:return i.LINEAR}}function D(a){switch(a){case THREE.RepeatWrapping:return i.REPEAT;case THREE.ClampToEdgeWrapping:return i.CLAMP_TO_EDGE;case THREE.MirroredRepeatWrapping:return i.MIRRORED_REPEAT;
case THREE.NearestFilter:return i.NEAREST;case THREE.NearestMipMapNearestFilter:return i.NEAREST_MIPMAP_NEAREST;case THREE.NearestMipMapLinearFilter:return i.NEAREST_MIPMAP_LINEAR;case THREE.LinearFilter:return i.LINEAR;case THREE.LinearMipMapNearestFilter:return i.LINEAR_MIPMAP_NEAREST;case THREE.LinearMipMapLinearFilter:return i.LINEAR_MIPMAP_LINEAR;case THREE.UnsignedByteType:return i.UNSIGNED_BYTE;case THREE.UnsignedShort4444Type:return i.UNSIGNED_SHORT_4_4_4_4;case THREE.UnsignedShort5551Type:return i.UNSIGNED_SHORT_5_5_5_1;
case THREE.UnsignedShort565Type:return i.UNSIGNED_SHORT_5_6_5;case THREE.ByteType:return i.BYTE;case THREE.ShortType:return i.SHORT;case THREE.UnsignedShortType:return i.UNSIGNED_SHORT;case THREE.IntType:return i.INT;case THREE.UnsignedIntType:return i.UNSIGNED_INT;case THREE.FloatType:return i.FLOAT;case THREE.AlphaFormat:return i.ALPHA;case THREE.RGBFormat:return i.RGB;case THREE.RGBAFormat:return i.RGBA;case THREE.LuminanceFormat:return i.LUMINANCE;case THREE.LuminanceAlphaFormat:return i.LUMINANCE_ALPHA;
case THREE.AddEquation:return i.FUNC_ADD;case THREE.SubtractEquation:return i.FUNC_SUBTRACT;case THREE.ReverseSubtractEquation:return i.FUNC_REVERSE_SUBTRACT;case THREE.ZeroFactor:return i.ZERO;case THREE.OneFactor:return i.ONE;case THREE.SrcColorFactor:return i.SRC_COLOR;case THREE.OneMinusSrcColorFactor:return i.ONE_MINUS_SRC_COLOR;case THREE.SrcAlphaFactor:return i.SRC_ALPHA;case THREE.OneMinusSrcAlphaFactor:return i.ONE_MINUS_SRC_ALPHA;case THREE.DstAlphaFactor:return i.DST_ALPHA;case THREE.OneMinusDstAlphaFactor:return i.ONE_MINUS_DST_ALPHA;
case THREE.DstColorFactor:return i.DST_COLOR;case THREE.OneMinusDstColorFactor:return i.ONE_MINUS_DST_COLOR;case THREE.SrcAlphaSaturateFactor:return i.SRC_ALPHA_SATURATE}return 0}console.log("THREE.WebGLRenderer",THREE.REVISION);var a=a||{},A=a.canvas!==void 0?a.canvas:document.createElement("canvas"),v=a.precision!==void 0?a.precision:"highp",H=a.alpha!==void 0?a.alpha:true,I=a.premultipliedAlpha!==void 0?a.premultipliedAlpha:true,M=a.antialias!==void 0?a.antialias:false,R=a.stencil!==void 0?a.stencil:
true,Z=a.preserveDrawingBuffer!==void 0?a.preserveDrawingBuffer:false,B=a.clearColor!==void 0?new THREE.Color(a.clearColor):new THREE.Color(0),G=a.clearAlpha!==void 0?a.clearAlpha:0,Q=a.maxLights!==void 0?a.maxLights:4;this.domElement=A;this.context=null;this.autoUpdateScene=this.autoUpdateObjects=this.sortObjects=this.autoClearStencil=this.autoClearDepth=this.autoClearColor=this.autoClear=true;this.shadowMapEnabled=this.physicallyBasedShading=this.gammaOutput=this.gammaInput=false;this.shadowMapCullFrontFaces=
this.shadowMapSoft=this.shadowMapAutoUpdate=true;this.shadowMapCascade=this.shadowMapDebug=false;this.maxMorphTargets=8;this.maxMorphNormals=4;this.autoScaleCubemaps=true;this.renderPluginsPre=[];this.renderPluginsPost=[];this.info={memory:{programs:0,geometries:0,textures:0},render:{calls:0,vertices:0,faces:0,points:0}};var C=this,i,P=[],L=0,S=null,aa=null,N=-1,ca=null,fa=null,O=0,$=-1,U=-1,Y=-1,ha=-1,Sa=-1,Ma=-1,Oa=-1,oa=-1,Ta=null,eb=null,fb=null,Za=null,Lb=0,mb=0,jb=0,nb=0,ab=0,Ba=0,ya=new THREE.Frustum,
gb=new THREE.Matrix4,wa=new THREE.Matrix4,Pa=new THREE.Vector4,Da=new THREE.Vector3,la=true,ob={ambient:[0,0,0],directional:{length:0,colors:[],positions:[]},point:{length:0,colors:[],positions:[],distances:[]},spot:{length:0,colors:[],positions:[],distances:[],directions:[],angles:[],exponents:[]}};i=function(){var a;try{if(!(a=A.getContext("experimental-webgl",{alpha:H,premultipliedAlpha:I,antialias:M,stencil:R,preserveDrawingBuffer:Z})))throw"Error creating WebGL context.";}catch(b){console.error(b)}a.getExtension("OES_texture_float")||
console.log("THREE.WebGLRenderer: Float textures not supported.");return a}();i.clearColor(0,0,0,1);i.clearDepth(1);i.clearStencil(0);i.enable(i.DEPTH_TEST);i.depthFunc(i.LEQUAL);i.frontFace(i.CCW);i.cullFace(i.BACK);i.enable(i.CULL_FACE);i.enable(i.BLEND);i.blendEquation(i.FUNC_ADD);i.blendFunc(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA);i.clearColor(B.r,B.g,B.b,G);this.context=i;var $a=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS);i.getParameter(i.MAX_TEXTURE_SIZE);var ac=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE);
this.getContext=function(){return i};this.supportsVertexTextures=function(){return $a>0};this.setSize=function(a,b){A.width=a;A.height=b;this.setViewport(0,0,A.width,A.height)};this.setViewport=function(a,b,c,d){Lb=a;mb=b;jb=c;nb=d;i.viewport(Lb,mb,jb,nb)};this.setScissor=function(a,b,c,d){i.scissor(a,b,c,d)};this.enableScissorTest=function(a){a?i.enable(i.SCISSOR_TEST):i.disable(i.SCISSOR_TEST)};this.setClearColorHex=function(a,b){B.setHex(a);G=b;i.clearColor(B.r,B.g,B.b,G)};this.setClearColor=function(a,
b){B.copy(a);G=b;i.clearColor(B.r,B.g,B.b,G)};this.getClearColor=function(){return B};this.getClearAlpha=function(){return G};this.clear=function(a,b,c){var d=0;if(a===void 0||a)d=d|i.COLOR_BUFFER_BIT;if(b===void 0||b)d=d|i.DEPTH_BUFFER_BIT;if(c===void 0||c)d=d|i.STENCIL_BUFFER_BIT;i.clear(d)};this.clearTarget=function(a,b,c,d){this.setRenderTarget(a);this.clear(b,c,d)};this.addPostPlugin=function(a){a.init(this);this.renderPluginsPost.push(a)};this.addPrePlugin=function(a){a.init(this);this.renderPluginsPre.push(a)};
this.deallocateObject=function(a){if(a.__webglInit){a.__webglInit=false;delete a._modelViewMatrix;delete a._normalMatrix;delete a._normalMatrixArray;delete a._modelViewMatrixArray;delete a._objectMatrixArray;if(a instanceof THREE.Mesh)for(var b in a.geometry.geometryGroups){var c=a.geometry.geometryGroups[b];i.deleteBuffer(c.__webglVertexBuffer);i.deleteBuffer(c.__webglNormalBuffer);i.deleteBuffer(c.__webglTangentBuffer);i.deleteBuffer(c.__webglColorBuffer);i.deleteBuffer(c.__webglUVBuffer);i.deleteBuffer(c.__webglUV2Buffer);
i.deleteBuffer(c.__webglSkinVertexABuffer);i.deleteBuffer(c.__webglSkinVertexBBuffer);i.deleteBuffer(c.__webglSkinIndicesBuffer);i.deleteBuffer(c.__webglSkinWeightsBuffer);i.deleteBuffer(c.__webglFaceBuffer);i.deleteBuffer(c.__webglLineBuffer);var d=void 0,e=void 0;if(c.numMorphTargets){d=0;for(e=c.numMorphTargets;d<e;d++)i.deleteBuffer(c.__webglMorphTargetsBuffers[d])}if(c.numMorphNormals){d=0;for(e=c.numMorphNormals;d<e;d++)i.deleteBuffer(c.__webglMorphNormalsBuffers[d])}if(c.__webglCustomAttributesList){d=
void 0;for(d in c.__webglCustomAttributesList)i.deleteBuffer(c.__webglCustomAttributesList[d].buffer)}C.info.memory.geometries--}else if(a instanceof THREE.Ribbon){a=a.geometry;i.deleteBuffer(a.__webglVertexBuffer);i.deleteBuffer(a.__webglColorBuffer);C.info.memory.geometries--}else if(a instanceof THREE.Line){a=a.geometry;i.deleteBuffer(a.__webglVertexBuffer);i.deleteBuffer(a.__webglColorBuffer);C.info.memory.geometries--}else if(a instanceof THREE.ParticleSystem){a=a.geometry;i.deleteBuffer(a.__webglVertexBuffer);
i.deleteBuffer(a.__webglColorBuffer);C.info.memory.geometries--}}};this.deallocateTexture=function(a){if(a.__webglInit){a.__webglInit=false;i.deleteTexture(a.__webglTexture);C.info.memory.textures--}};this.deallocateRenderTarget=function(a){if(a&&a.__webglTexture){i.deleteTexture(a.__webglTexture);if(a instanceof THREE.WebGLRenderTargetCube)for(var b=0;b<6;b++){i.deleteFramebuffer(a.__webglFramebuffer[b]);i.deleteRenderbuffer(a.__webglRenderbuffer[b])}else{i.deleteFramebuffer(a.__webglFramebuffer);
i.deleteRenderbuffer(a.__webglRenderbuffer)}}};this.deallocateMaterial=function(a){var b=a.program;if(b){a.program=void 0;var c,d,e=false,a=0;for(c=P.length;a<c;a++){d=P[a];if(d.program===b){d.usedTimes--;d.usedTimes===0&&(e=true);break}}if(e){e=[];a=0;for(c=P.length;a<c;a++){d=P[a];d.program!==b&&e.push(d)}P=e;i.deleteProgram(b);C.info.memory.programs--}}};this.updateShadowMap=function(a,b){S=null;N=ca=oa=Oa=Y=-1;la=true;U=$=-1;this.shadowMapPlugin.update(a,b)};this.renderBufferImmediate=function(a,
b,c){if(a.hasPositions&&!a.__webglVertexBuffer)a.__webglVertexBuffer=i.createBuffer();if(a.hasNormals&&!a.__webglNormalBuffer)a.__webglNormalBuffer=i.createBuffer();if(a.hasUvs&&!a.__webglUvBuffer)a.__webglUvBuffer=i.createBuffer();if(a.hasColors&&!a.__webglColorBuffer)a.__webglColorBuffer=i.createBuffer();if(a.hasPositions){i.bindBuffer(i.ARRAY_BUFFER,a.__webglVertexBuffer);i.bufferData(i.ARRAY_BUFFER,a.positionArray,i.DYNAMIC_DRAW);i.enableVertexAttribArray(b.attributes.position);i.vertexAttribPointer(b.attributes.position,
3,i.FLOAT,false,0,0)}if(a.hasNormals){i.bindBuffer(i.ARRAY_BUFFER,a.__webglNormalBuffer);if(c.shading===THREE.FlatShading){var d,e,f,g,h,j,k,l,m,n,o,p=a.count*3;for(o=0;o<p;o=o+9){n=a.normalArray;d=n[o];e=n[o+1];f=n[o+2];g=n[o+3];j=n[o+4];l=n[o+5];h=n[o+6];k=n[o+7];m=n[o+8];d=(d+g+h)/3;e=(e+j+k)/3;f=(f+l+m)/3;n[o]=d;n[o+1]=e;n[o+2]=f;n[o+3]=d;n[o+4]=e;n[o+5]=f;n[o+6]=d;n[o+7]=e;n[o+8]=f}}i.bufferData(i.ARRAY_BUFFER,a.normalArray,i.DYNAMIC_DRAW);i.enableVertexAttribArray(b.attributes.normal);i.vertexAttribPointer(b.attributes.normal,
3,i.FLOAT,false,0,0)}if(a.hasUvs&&c.map){i.bindBuffer(i.ARRAY_BUFFER,a.__webglUvBuffer);i.bufferData(i.ARRAY_BUFFER,a.uvArray,i.DYNAMIC_DRAW);i.enableVertexAttribArray(b.attributes.uv);i.vertexAttribPointer(b.attributes.uv,2,i.FLOAT,false,0,0)}if(a.hasColors&&c.vertexColors!==THREE.NoColors){i.bindBuffer(i.ARRAY_BUFFER,a.__webglColorBuffer);i.bufferData(i.ARRAY_BUFFER,a.colorArray,i.DYNAMIC_DRAW);i.enableVertexAttribArray(b.attributes.color);i.vertexAttribPointer(b.attributes.color,3,i.FLOAT,false,
0,0)}i.drawArrays(i.TRIANGLES,0,a.count);a.count=0};this.renderBufferDirect=function(a,b,c,d,e,f){if(d.visible!==false){c=q(a,b,c,d,f);a=c.attributes;b=false;d=e.id*16777215+c.id*2+(d.wireframe?1:0);if(d!==ca){ca=d;b=true}if(f instanceof THREE.Mesh){f=e.offsets;d=0;for(c=f.length;d<c;++d){if(b){i.bindBuffer(i.ARRAY_BUFFER,e.vertexPositionBuffer);i.vertexAttribPointer(a.position,e.vertexPositionBuffer.itemSize,i.FLOAT,false,0,f[d].index*12);if(a.normal>=0&&e.vertexNormalBuffer){i.bindBuffer(i.ARRAY_BUFFER,
e.vertexNormalBuffer);i.vertexAttribPointer(a.normal,e.vertexNormalBuffer.itemSize,i.FLOAT,false,0,f[d].index*12)}if(a.uv>=0&&e.vertexUvBuffer)if(e.vertexUvBuffer){i.bindBuffer(i.ARRAY_BUFFER,e.vertexUvBuffer);i.vertexAttribPointer(a.uv,e.vertexUvBuffer.itemSize,i.FLOAT,false,0,f[d].index*8);i.enableVertexAttribArray(a.uv)}else i.disableVertexAttribArray(a.uv);if(a.color>=0&&e.vertexColorBuffer){i.bindBuffer(i.ARRAY_BUFFER,e.vertexColorBuffer);i.vertexAttribPointer(a.color,e.vertexColorBuffer.itemSize,
i.FLOAT,false,0,f[d].index*16)}i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.vertexIndexBuffer)}i.drawElements(i.TRIANGLES,f[d].count,i.UNSIGNED_SHORT,f[d].start*2);C.info.render.calls++;C.info.render.vertices=C.info.render.vertices+f[d].count;C.info.render.faces=C.info.render.faces+f[d].count/3}}}};this.renderBuffer=function(a,b,c,d,e,f){if(d.visible!==false){var g,j,c=q(a,b,c,d,f),b=c.attributes,a=false,c=e.id*16777215+c.id*2+(d.wireframe?1:0);if(c!==ca){ca=c;a=true}if(!d.morphTargets&&b.position>=0){if(a){i.bindBuffer(i.ARRAY_BUFFER,
e.__webglVertexBuffer);i.vertexAttribPointer(b.position,3,i.FLOAT,false,0,0)}}else if(f.morphTargetBase){c=d.program.attributes;if(f.morphTargetBase!==-1){i.bindBuffer(i.ARRAY_BUFFER,e.__webglMorphTargetsBuffers[f.morphTargetBase]);i.vertexAttribPointer(c.position,3,i.FLOAT,false,0,0)}else if(c.position>=0){i.bindBuffer(i.ARRAY_BUFFER,e.__webglVertexBuffer);i.vertexAttribPointer(c.position,3,i.FLOAT,false,0,0)}if(f.morphTargetForcedOrder.length){var k=0;j=f.morphTargetForcedOrder;for(g=f.morphTargetInfluences;k<
d.numSupportedMorphTargets&&k<j.length;){i.bindBuffer(i.ARRAY_BUFFER,e.__webglMorphTargetsBuffers[j[k]]);i.vertexAttribPointer(c["morphTarget"+k],3,i.FLOAT,false,0,0);if(d.morphNormals){i.bindBuffer(i.ARRAY_BUFFER,e.__webglMorphNormalsBuffers[j[k]]);i.vertexAttribPointer(c["morphNormal"+k],3,i.FLOAT,false,0,0)}f.__webglMorphTargetInfluences[k]=g[j[k]];k++}}else{j=[];g=f.morphTargetInfluences;var l,m=g.length;for(l=0;l<m;l++){k=g[l];k>0&&j.push([l,k])}if(j.length>d.numSupportedMorphTargets){j.sort(h);
j.length=d.numSupportedMorphTargets}else j.length>d.numSupportedMorphNormals?j.sort(h):j.length===0&&j.push([0,0]);for(k=0;k<d.numSupportedMorphTargets;){if(j[k]){l=j[k][0];i.bindBuffer(i.ARRAY_BUFFER,e.__webglMorphTargetsBuffers[l]);i.vertexAttribPointer(c["morphTarget"+k],3,i.FLOAT,false,0,0);if(d.morphNormals){i.bindBuffer(i.ARRAY_BUFFER,e.__webglMorphNormalsBuffers[l]);i.vertexAttribPointer(c["morphNormal"+k],3,i.FLOAT,false,0,0)}f.__webglMorphTargetInfluences[k]=g[l]}else{i.vertexAttribPointer(c["morphTarget"+
k],3,i.FLOAT,false,0,0);d.morphNormals&&i.vertexAttribPointer(c["morphNormal"+k],3,i.FLOAT,false,0,0);f.__webglMorphTargetInfluences[k]=0}k++}}d.program.uniforms.morphTargetInfluences!==null&&i.uniform1fv(d.program.uniforms.morphTargetInfluences,f.__webglMorphTargetInfluences)}if(a){if(e.__webglCustomAttributesList){g=0;for(j=e.__webglCustomAttributesList.length;g<j;g++){c=e.__webglCustomAttributesList[g];if(b[c.buffer.belongsToAttribute]>=0){i.bindBuffer(i.ARRAY_BUFFER,c.buffer);i.vertexAttribPointer(b[c.buffer.belongsToAttribute],
c.size,i.FLOAT,false,0,0)}}}if(b.color>=0){i.bindBuffer(i.ARRAY_BUFFER,e.__webglColorBuffer);i.vertexAttribPointer(b.color,3,i.FLOAT,false,0,0)}if(b.normal>=0){i.bindBuffer(i.ARRAY_BUFFER,e.__webglNormalBuffer);i.vertexAttribPointer(b.normal,3,i.FLOAT,false,0,0)}if(b.tangent>=0){i.bindBuffer(i.ARRAY_BUFFER,e.__webglTangentBuffer);i.vertexAttribPointer(b.tangent,4,i.FLOAT,false,0,0)}if(b.uv>=0)if(e.__webglUVBuffer){i.bindBuffer(i.ARRAY_BUFFER,e.__webglUVBuffer);i.vertexAttribPointer(b.uv,2,i.FLOAT,
false,0,0);i.enableVertexAttribArray(b.uv)}else i.disableVertexAttribArray(b.uv);if(b.uv2>=0)if(e.__webglUV2Buffer){i.bindBuffer(i.ARRAY_BUFFER,e.__webglUV2Buffer);i.vertexAttribPointer(b.uv2,2,i.FLOAT,false,0,0);i.enableVertexAttribArray(b.uv2)}else i.disableVertexAttribArray(b.uv2);if(d.skinning&&b.skinVertexA>=0&&b.skinVertexB>=0&&b.skinIndex>=0&&b.skinWeight>=0){i.bindBuffer(i.ARRAY_BUFFER,e.__webglSkinVertexABuffer);i.vertexAttribPointer(b.skinVertexA,4,i.FLOAT,false,0,0);i.bindBuffer(i.ARRAY_BUFFER,
e.__webglSkinVertexBBuffer);i.vertexAttribPointer(b.skinVertexB,4,i.FLOAT,false,0,0);i.bindBuffer(i.ARRAY_BUFFER,e.__webglSkinIndicesBuffer);i.vertexAttribPointer(b.skinIndex,4,i.FLOAT,false,0,0);i.bindBuffer(i.ARRAY_BUFFER,e.__webglSkinWeightsBuffer);i.vertexAttribPointer(b.skinWeight,4,i.FLOAT,false,0,0)}}if(f instanceof THREE.Mesh){if(d.wireframe){d=d.wireframeLinewidth;if(d!==Za){i.lineWidth(d);Za=d}a&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.__webglLineBuffer);i.drawElements(i.LINES,e.__webglLineCount,
i.UNSIGNED_SHORT,0)}else{a&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.__webglFaceBuffer);i.drawElements(i.TRIANGLES,e.__webglFaceCount,i.UNSIGNED_SHORT,0)}C.info.render.calls++;C.info.render.vertices=C.info.render.vertices+e.__webglFaceCount;C.info.render.faces=C.info.render.faces+e.__webglFaceCount/3}else if(f instanceof THREE.Line){f=f.type===THREE.LineStrip?i.LINE_STRIP:i.LINES;d=d.linewidth;if(d!==Za){i.lineWidth(d);Za=d}i.drawArrays(f,0,e.__webglLineCount);C.info.render.calls++}else if(f instanceof
THREE.ParticleSystem){i.drawArrays(i.POINTS,0,e.__webglParticleCount);C.info.render.calls++;C.info.render.points=C.info.render.points+e.__webglParticleCount}else if(f instanceof THREE.Ribbon){i.drawArrays(i.TRIANGLE_STRIP,0,e.__webglVertexCount);C.info.render.calls++}}};this.render=function(a,b,c,d){var e,f,h,m,n=a.__lights,o=a.fog;N=-1;la=true;if(b.parent===void 0){console.warn("DEPRECATED: Camera hasn't been added to a Scene. Adding it...");a.add(b)}this.autoUpdateScene&&a.updateMatrixWorld();if(!b._viewMatrixArray)b._viewMatrixArray=
new Float32Array(16);if(!b._projectionMatrixArray)b._projectionMatrixArray=new Float32Array(16);b.matrixWorldInverse.getInverse(b.matrixWorld);b.matrixWorldInverse.flattenToArray(b._viewMatrixArray);b.projectionMatrix.flattenToArray(b._projectionMatrixArray);gb.multiply(b.projectionMatrix,b.matrixWorldInverse);ya.setFromMatrix(gb);this.autoUpdateObjects&&this.initWebGLObjects(a);j(this.renderPluginsPre,a,b);C.info.render.calls=0;C.info.render.vertices=0;C.info.render.faces=0;C.info.render.points=
0;this.setRenderTarget(c);(this.autoClear||d)&&this.clear(this.autoClearColor,this.autoClearDepth,this.autoClearStencil);m=a.__webglObjects;d=0;for(e=m.length;d<e;d++){f=m[d];h=f.object;f.render=false;if(h.visible&&(!(h instanceof THREE.Mesh||h instanceof THREE.ParticleSystem)||!h.frustumCulled||ya.contains(h))){u(h,b);var p=f,r=p.object,q=p.buffer,s=void 0,s=s=void 0,s=r.material;if(s instanceof THREE.MeshFaceMaterial){s=q.materialIndex;if(s>=0){s=r.geometry.materials[s];if(s.transparent){p.transparent=
s;p.opaque=null}else{p.opaque=s;p.transparent=null}}}else if(s)if(s.transparent){p.transparent=s;p.opaque=null}else{p.opaque=s;p.transparent=null}f.render=true;if(this.sortObjects)if(h.renderDepth)f.z=h.renderDepth;else{Pa.copy(h.matrixWorld.getPosition());gb.multiplyVector3(Pa);f.z=Pa.z}}}this.sortObjects&&m.sort(g);m=a.__webglObjectsImmediate;d=0;for(e=m.length;d<e;d++){f=m[d];h=f.object;if(h.visible){u(h,b);h=f.object.material;if(h.transparent){f.transparent=h;f.opaque=null}else{f.opaque=h;f.transparent=
null}}}if(a.overrideMaterial){d=a.overrideMaterial;this.setBlending(d.blending,d.blendEquation,d.blendSrc,d.blendDst);this.setDepthTest(d.depthTest);this.setDepthWrite(d.depthWrite);t(d.polygonOffset,d.polygonOffsetFactor,d.polygonOffsetUnits);k(a.__webglObjects,false,"",b,n,o,true,d);l(a.__webglObjectsImmediate,"",b,n,o,false,d)}else{this.setBlending(THREE.NormalBlending);k(a.__webglObjects,true,"opaque",b,n,o,false);l(a.__webglObjectsImmediate,"opaque",b,n,o,false);k(a.__webglObjects,false,"transparent",
b,n,o,true);l(a.__webglObjectsImmediate,"transparent",b,n,o,true)}j(this.renderPluginsPost,a,b);if(c&&c.generateMipmaps&&c.minFilter!==THREE.NearestFilter&&c.minFilter!==THREE.LinearFilter)if(c instanceof THREE.WebGLRenderTargetCube){i.bindTexture(i.TEXTURE_CUBE_MAP,c.__webglTexture);i.generateMipmap(i.TEXTURE_CUBE_MAP);i.bindTexture(i.TEXTURE_CUBE_MAP,null)}else{i.bindTexture(i.TEXTURE_2D,c.__webglTexture);i.generateMipmap(i.TEXTURE_2D);i.bindTexture(i.TEXTURE_2D,null)}this.setDepthTest(true);this.setDepthWrite(true)};
this.renderImmediateObject=function(a,b,c,d,e){var f=q(a,b,c,d,e);ca=-1;C.setObjectFaces(e);e.immediateRenderCallback?e.immediateRenderCallback(f,i,ya):e.render(function(a){C.renderBufferImmediate(a,f,d)})};this.initWebGLObjects=function(a){if(!a.__webglObjects){a.__webglObjects=[];a.__webglObjectsImmediate=[];a.__webglSprites=[];a.__webglFlares=[]}for(;a.__objectsAdded.length;){var g=a.__objectsAdded[0],h=a,j=void 0,k=void 0,l=void 0;if(!g.__webglInit){g.__webglInit=true;g._modelViewMatrix=new THREE.Matrix4;
g._normalMatrix=new THREE.Matrix3;if(g instanceof THREE.Mesh){k=g.geometry;if(k instanceof THREE.Geometry){if(k.geometryGroups===void 0){var q=k,s=void 0,t=void 0,u=void 0,v=void 0,x=void 0,y=void 0,A=void 0,B={},D=q.morphTargets.length,H=q.morphNormals.length;q.geometryGroups={};s=0;for(t=q.faces.length;s<t;s++){u=q.faces[s];v=u.materialIndex;y=v!==void 0?v:-1;B[y]===void 0&&(B[y]={hash:y,counter:0});A=B[y].hash+"_"+B[y].counter;q.geometryGroups[A]===void 0&&(q.geometryGroups[A]={faces3:[],faces4:[],
materialIndex:v,vertices:0,numMorphTargets:D,numMorphNormals:H});x=u instanceof THREE.Face3?3:4;if(q.geometryGroups[A].vertices+x>65535){B[y].counter=B[y].counter+1;A=B[y].hash+"_"+B[y].counter;q.geometryGroups[A]===void 0&&(q.geometryGroups[A]={faces3:[],faces4:[],materialIndex:v,vertices:0,numMorphTargets:D,numMorphNormals:H})}u instanceof THREE.Face3?q.geometryGroups[A].faces3.push(s):q.geometryGroups[A].faces4.push(s);q.geometryGroups[A].vertices=q.geometryGroups[A].vertices+x}q.geometryGroupsList=
[];var N=void 0;for(N in q.geometryGroups){q.geometryGroups[N].id=O++;q.geometryGroupsList.push(q.geometryGroups[N])}}for(j in k.geometryGroups){l=k.geometryGroups[j];if(!l.__webglVertexBuffer){var E=l;E.__webglVertexBuffer=i.createBuffer();E.__webglNormalBuffer=i.createBuffer();E.__webglTangentBuffer=i.createBuffer();E.__webglColorBuffer=i.createBuffer();E.__webglUVBuffer=i.createBuffer();E.__webglUV2Buffer=i.createBuffer();E.__webglSkinVertexABuffer=i.createBuffer();E.__webglSkinVertexBBuffer=i.createBuffer();
E.__webglSkinIndicesBuffer=i.createBuffer();E.__webglSkinWeightsBuffer=i.createBuffer();E.__webglFaceBuffer=i.createBuffer();E.__webglLineBuffer=i.createBuffer();var $=void 0,I=void 0;if(E.numMorphTargets){E.__webglMorphTargetsBuffers=[];$=0;for(I=E.numMorphTargets;$<I;$++)E.__webglMorphTargetsBuffers.push(i.createBuffer())}if(E.numMorphNormals){E.__webglMorphNormalsBuffers=[];$=0;for(I=E.numMorphNormals;$<I;$++)E.__webglMorphNormalsBuffers.push(i.createBuffer())}C.info.memory.geometries++;var G=
l,M=g,Y=M.geometry,L=G.faces3,S=G.faces4,U=L.length*3+S.length*4,Q=L.length*1+S.length*2,P=L.length*3+S.length*4,R=c(M,G),aa=e(R),Z=d(R),fa=R.vertexColors?R.vertexColors:false;G.__vertexArray=new Float32Array(U*3);if(Z)G.__normalArray=new Float32Array(U*3);if(Y.hasTangents)G.__tangentArray=new Float32Array(U*4);if(fa)G.__colorArray=new Float32Array(U*3);if(aa){if(Y.faceUvs.length>0||Y.faceVertexUvs.length>0)G.__uvArray=new Float32Array(U*2);if(Y.faceUvs.length>1||Y.faceVertexUvs.length>1)G.__uv2Array=
new Float32Array(U*2)}if(M.geometry.skinWeights.length&&M.geometry.skinIndices.length){G.__skinVertexAArray=new Float32Array(U*4);G.__skinVertexBArray=new Float32Array(U*4);G.__skinIndexArray=new Float32Array(U*4);G.__skinWeightArray=new Float32Array(U*4)}G.__faceArray=new Uint16Array(Q*3);G.__lineArray=new Uint16Array(P*2);var ca=void 0,ha=void 0;if(G.numMorphTargets){G.__morphTargetsArrays=[];ca=0;for(ha=G.numMorphTargets;ca<ha;ca++)G.__morphTargetsArrays.push(new Float32Array(U*3))}if(G.numMorphNormals){G.__morphNormalsArrays=
[];ca=0;for(ha=G.numMorphNormals;ca<ha;ca++)G.__morphNormalsArrays.push(new Float32Array(U*3))}G.__webglFaceCount=Q*3;G.__webglLineCount=P*2;if(R.attributes){if(G.__webglCustomAttributesList===void 0)G.__webglCustomAttributesList=[];var Oa=void 0;for(Oa in R.attributes){var Sa=R.attributes[Oa],oa={},la;for(la in Sa)oa[la]=Sa[la];if(!oa.__webglInitialized||oa.createUniqueBuffers){oa.__webglInitialized=true;var Ma=1;oa.type==="v2"?Ma=2:oa.type==="v3"?Ma=3:oa.type==="v4"?Ma=4:oa.type==="c"&&(Ma=3);oa.size=
Ma;oa.array=new Float32Array(U*Ma);oa.buffer=i.createBuffer();oa.buffer.belongsToAttribute=Oa;Sa.needsUpdate=true;oa.__original=Sa}G.__webglCustomAttributesList.push(oa)}}G.__inittedArrays=true;k.verticesNeedUpdate=true;k.morphTargetsNeedUpdate=true;k.elementsNeedUpdate=true;k.uvsNeedUpdate=true;k.normalsNeedUpdate=true;k.tangetsNeedUpdate=true;k.colorsNeedUpdate=true}}}}else if(g instanceof THREE.Ribbon){k=g.geometry;if(!k.__webglVertexBuffer){var Ta=k;Ta.__webglVertexBuffer=i.createBuffer();Ta.__webglColorBuffer=
i.createBuffer();C.info.memory.geometries++;var wa=k,ya=wa.vertices.length;wa.__vertexArray=new Float32Array(ya*3);wa.__colorArray=new Float32Array(ya*3);wa.__webglVertexCount=ya;k.verticesNeedUpdate=true;k.colorsNeedUpdate=true}}else if(g instanceof THREE.Line){k=g.geometry;if(!k.__webglVertexBuffer){var Da=k;Da.__webglVertexBuffer=i.createBuffer();Da.__webglColorBuffer=i.createBuffer();C.info.memory.geometries++;var Ba=k,eb=g,Pa=Ba.vertices.length;Ba.__vertexArray=new Float32Array(Pa*3);Ba.__colorArray=
new Float32Array(Pa*3);Ba.__webglLineCount=Pa;b(Ba,eb);k.verticesNeedUpdate=true;k.colorsNeedUpdate=true}}else if(g instanceof THREE.ParticleSystem){k=g.geometry;if(!k.__webglVertexBuffer){var ab=k;ab.__webglVertexBuffer=i.createBuffer();ab.__webglColorBuffer=i.createBuffer();C.info.geometries++;var Za=k,Lb=g,mb=Za.vertices.length;Za.__vertexArray=new Float32Array(mb*3);Za.__colorArray=new Float32Array(mb*3);Za.__sortArray=[];Za.__webglParticleCount=mb;b(Za,Lb);k.verticesNeedUpdate=true;k.colorsNeedUpdate=
true}}}if(!g.__webglActive){if(g instanceof THREE.Mesh){k=g.geometry;if(k instanceof THREE.BufferGeometry)o(h.__webglObjects,k,g);else for(j in k.geometryGroups){l=k.geometryGroups[j];o(h.__webglObjects,l,g)}}else if(g instanceof THREE.Ribbon||g instanceof THREE.Line||g instanceof THREE.ParticleSystem){k=g.geometry;o(h.__webglObjects,k,g)}else g instanceof THREE.ImmediateRenderObject||g.immediateRenderCallback?h.__webglObjectsImmediate.push({object:g,opaque:null,transparent:null}):g instanceof THREE.Sprite?
h.__webglSprites.push(g):g instanceof THREE.LensFlare&&h.__webglFlares.push(g);g.__webglActive=true}a.__objectsAdded.splice(0,1)}for(;a.__objectsRemoved.length;){var bb=a.__objectsRemoved[0],jb=a;bb instanceof THREE.Mesh||bb instanceof THREE.ParticleSystem||bb instanceof THREE.Ribbon||bb instanceof THREE.Line?r(jb.__webglObjects,bb):bb instanceof THREE.Sprite?n(jb.__webglSprites,bb):bb instanceof THREE.LensFlare?n(jb.__webglFlares,bb):(bb instanceof THREE.ImmediateRenderObject||bb.immediateRenderCallback)&&
r(jb.__webglObjectsImmediate,bb);bb.__webglActive=false;a.__objectsRemoved.splice(0,1)}for(var gb=0,ob=a.__webglObjects.length;gb<ob;gb++){var kb=a.__webglObjects[gb].object,ga=kb.geometry,$a=void 0,fb=void 0,Ua=void 0;if(kb instanceof THREE.Mesh)if(ga instanceof THREE.BufferGeometry){ga.verticesNeedUpdate=false;ga.elementsNeedUpdate=false;ga.uvsNeedUpdate=false;ga.normalsNeedUpdate=false;ga.colorsNeedUpdate=false}else{for(var nb=0,ac=ga.geometryGroupsList.length;nb<ac;nb++){$a=ga.geometryGroupsList[nb];
Ua=c(kb,$a);fb=Ua.attributes&&m(Ua);if(ga.verticesNeedUpdate||ga.morphTargetsNeedUpdate||ga.elementsNeedUpdate||ga.uvsNeedUpdate||ga.normalsNeedUpdate||ga.colorsNeedUpdate||ga.tangetsNeedUpdate||fb){var da=$a,md=kb,Wa=i.DYNAMIC_DRAW,nd=!ga.dynamic,cc=Ua;if(da.__inittedArrays){var bd=d(cc),Sc=cc.vertexColors?cc.vertexColors:false,cd=e(cc),Ec=bd===THREE.SmoothShading,F=void 0,T=void 0,ib=void 0,K=void 0,jc=void 0,Ob=void 0,lb=void 0,Fc=void 0,Gb=void 0,kc=void 0,lc=void 0,V=void 0,W=void 0,X=void 0,
ma=void 0,pb=void 0,qb=void 0,rb=void 0,qc=void 0,sb=void 0,tb=void 0,ub=void 0,rc=void 0,vb=void 0,wb=void 0,xb=void 0,sc=void 0,yb=void 0,zb=void 0,Ab=void 0,tc=void 0,Bb=void 0,Cb=void 0,Db=void 0,uc=void 0,Pb=void 0,Qb=void 0,Rb=void 0,Gc=void 0,Sb=void 0,Tb=void 0,Ub=void 0,Hc=void 0,ia=void 0,dd=void 0,Vb=void 0,mc=void 0,nc=void 0,Ga=void 0,ed=void 0,Ea=void 0,Fa=void 0,Wb=void 0,Hb=void 0,xa=0,Ca=0,Ib=0,Jb=0,cb=0,Na=0,na=0,Qa=0,za=0,J=0,ba=0,z=0,Xa=void 0,Ha=da.__vertexArray,vc=da.__uvArray,
wc=da.__uv2Array,db=da.__normalArray,qa=da.__tangentArray,Ia=da.__colorArray,ra=da.__skinVertexAArray,sa=da.__skinVertexBArray,ta=da.__skinIndexArray,ua=da.__skinWeightArray,Tc=da.__morphTargetsArrays,Uc=da.__morphNormalsArrays,Vc=da.__webglCustomAttributesList,w=void 0,Eb=da.__faceArray,Ya=da.__lineArray,Ra=md.geometry,od=Ra.elementsNeedUpdate,fd=Ra.uvsNeedUpdate,pd=Ra.normalsNeedUpdate,qd=Ra.tangetsNeedUpdate,rd=Ra.colorsNeedUpdate,sd=Ra.morphTargetsNeedUpdate,dc=Ra.vertices,ja=da.faces3,ka=da.faces4,
Aa=Ra.faces,Wc=Ra.faceVertexUvs[0],Xc=Ra.faceVertexUvs[1],ec=Ra.skinVerticesA,fc=Ra.skinVerticesB,gc=Ra.skinIndices,Xb=Ra.skinWeights,Yb=Ra.morphTargets,Ic=Ra.morphNormals;if(Ra.verticesNeedUpdate){F=0;for(T=ja.length;F<T;F++){K=Aa[ja[F]];V=dc[K.a];W=dc[K.b];X=dc[K.c];Ha[Ca]=V.x;Ha[Ca+1]=V.y;Ha[Ca+2]=V.z;Ha[Ca+3]=W.x;Ha[Ca+4]=W.y;Ha[Ca+5]=W.z;Ha[Ca+6]=X.x;Ha[Ca+7]=X.y;Ha[Ca+8]=X.z;Ca=Ca+9}F=0;for(T=ka.length;F<T;F++){K=Aa[ka[F]];V=dc[K.a];W=dc[K.b];X=dc[K.c];ma=dc[K.d];Ha[Ca]=V.x;Ha[Ca+1]=V.y;Ha[Ca+
2]=V.z;Ha[Ca+3]=W.x;Ha[Ca+4]=W.y;Ha[Ca+5]=W.z;Ha[Ca+6]=X.x;Ha[Ca+7]=X.y;Ha[Ca+8]=X.z;Ha[Ca+9]=ma.x;Ha[Ca+10]=ma.y;Ha[Ca+11]=ma.z;Ca=Ca+12}i.bindBuffer(i.ARRAY_BUFFER,da.__webglVertexBuffer);i.bufferData(i.ARRAY_BUFFER,Ha,Wa)}if(sd){Ga=0;for(ed=Yb.length;Ga<ed;Ga++){F=ba=0;for(T=ja.length;F<T;F++){Wb=ja[F];K=Aa[Wb];V=Yb[Ga].vertices[K.a];W=Yb[Ga].vertices[K.b];X=Yb[Ga].vertices[K.c];Ea=Tc[Ga];Ea[ba]=V.x;Ea[ba+1]=V.y;Ea[ba+2]=V.z;Ea[ba+3]=W.x;Ea[ba+4]=W.y;Ea[ba+5]=W.z;Ea[ba+6]=X.x;Ea[ba+7]=X.y;Ea[ba+
8]=X.z;if(cc.morphNormals){if(Ec){Hb=Ic[Ga].vertexNormals[Wb];sb=Hb.a;tb=Hb.b;ub=Hb.c}else ub=tb=sb=Ic[Ga].faceNormals[Wb];Fa=Uc[Ga];Fa[ba]=sb.x;Fa[ba+1]=sb.y;Fa[ba+2]=sb.z;Fa[ba+3]=tb.x;Fa[ba+4]=tb.y;Fa[ba+5]=tb.z;Fa[ba+6]=ub.x;Fa[ba+7]=ub.y;Fa[ba+8]=ub.z}ba=ba+9}F=0;for(T=ka.length;F<T;F++){Wb=ka[F];K=Aa[Wb];V=Yb[Ga].vertices[K.a];W=Yb[Ga].vertices[K.b];X=Yb[Ga].vertices[K.c];ma=Yb[Ga].vertices[K.d];Ea=Tc[Ga];Ea[ba]=V.x;Ea[ba+1]=V.y;Ea[ba+2]=V.z;Ea[ba+3]=W.x;Ea[ba+4]=W.y;Ea[ba+5]=W.z;Ea[ba+6]=X.x;
Ea[ba+7]=X.y;Ea[ba+8]=X.z;Ea[ba+9]=ma.x;Ea[ba+10]=ma.y;Ea[ba+11]=ma.z;if(cc.morphNormals){if(Ec){Hb=Ic[Ga].vertexNormals[Wb];sb=Hb.a;tb=Hb.b;ub=Hb.c;rc=Hb.d}else rc=ub=tb=sb=Ic[Ga].faceNormals[Wb];Fa=Uc[Ga];Fa[ba]=sb.x;Fa[ba+1]=sb.y;Fa[ba+2]=sb.z;Fa[ba+3]=tb.x;Fa[ba+4]=tb.y;Fa[ba+5]=tb.z;Fa[ba+6]=ub.x;Fa[ba+7]=ub.y;Fa[ba+8]=ub.z;Fa[ba+9]=rc.x;Fa[ba+10]=rc.y;Fa[ba+11]=rc.z}ba=ba+12}i.bindBuffer(i.ARRAY_BUFFER,da.__webglMorphTargetsBuffers[Ga]);i.bufferData(i.ARRAY_BUFFER,Tc[Ga],Wa);if(cc.morphNormals){i.bindBuffer(i.ARRAY_BUFFER,
da.__webglMorphNormalsBuffers[Ga]);i.bufferData(i.ARRAY_BUFFER,Uc[Ga],Wa)}}}if(Xb.length){F=0;for(T=ja.length;F<T;F++){K=Aa[ja[F]];yb=Xb[K.a];zb=Xb[K.b];Ab=Xb[K.c];ua[J]=yb.x;ua[J+1]=yb.y;ua[J+2]=yb.z;ua[J+3]=yb.w;ua[J+4]=zb.x;ua[J+5]=zb.y;ua[J+6]=zb.z;ua[J+7]=zb.w;ua[J+8]=Ab.x;ua[J+9]=Ab.y;ua[J+10]=Ab.z;ua[J+11]=Ab.w;Bb=gc[K.a];Cb=gc[K.b];Db=gc[K.c];ta[J]=Bb.x;ta[J+1]=Bb.y;ta[J+2]=Bb.z;ta[J+3]=Bb.w;ta[J+4]=Cb.x;ta[J+5]=Cb.y;ta[J+6]=Cb.z;ta[J+7]=Cb.w;ta[J+8]=Db.x;ta[J+9]=Db.y;ta[J+10]=Db.z;ta[J+11]=
Db.w;Pb=ec[K.a];Qb=ec[K.b];Rb=ec[K.c];ra[J]=Pb.x;ra[J+1]=Pb.y;ra[J+2]=Pb.z;ra[J+3]=1;ra[J+4]=Qb.x;ra[J+5]=Qb.y;ra[J+6]=Qb.z;ra[J+7]=1;ra[J+8]=Rb.x;ra[J+9]=Rb.y;ra[J+10]=Rb.z;ra[J+11]=1;Sb=fc[K.a];Tb=fc[K.b];Ub=fc[K.c];sa[J]=Sb.x;sa[J+1]=Sb.y;sa[J+2]=Sb.z;sa[J+3]=1;sa[J+4]=Tb.x;sa[J+5]=Tb.y;sa[J+6]=Tb.z;sa[J+7]=1;sa[J+8]=Ub.x;sa[J+9]=Ub.y;sa[J+10]=Ub.z;sa[J+11]=1;J=J+12}F=0;for(T=ka.length;F<T;F++){K=Aa[ka[F]];yb=Xb[K.a];zb=Xb[K.b];Ab=Xb[K.c];tc=Xb[K.d];ua[J]=yb.x;ua[J+1]=yb.y;ua[J+2]=yb.z;ua[J+3]=
yb.w;ua[J+4]=zb.x;ua[J+5]=zb.y;ua[J+6]=zb.z;ua[J+7]=zb.w;ua[J+8]=Ab.x;ua[J+9]=Ab.y;ua[J+10]=Ab.z;ua[J+11]=Ab.w;ua[J+12]=tc.x;ua[J+13]=tc.y;ua[J+14]=tc.z;ua[J+15]=tc.w;Bb=gc[K.a];Cb=gc[K.b];Db=gc[K.c];uc=gc[K.d];ta[J]=Bb.x;ta[J+1]=Bb.y;ta[J+2]=Bb.z;ta[J+3]=Bb.w;ta[J+4]=Cb.x;ta[J+5]=Cb.y;ta[J+6]=Cb.z;ta[J+7]=Cb.w;ta[J+8]=Db.x;ta[J+9]=Db.y;ta[J+10]=Db.z;ta[J+11]=Db.w;ta[J+12]=uc.x;ta[J+13]=uc.y;ta[J+14]=uc.z;ta[J+15]=uc.w;Pb=ec[K.a];Qb=ec[K.b];Rb=ec[K.c];Gc=ec[K.d];ra[J]=Pb.x;ra[J+1]=Pb.y;ra[J+2]=Pb.z;
ra[J+3]=1;ra[J+4]=Qb.x;ra[J+5]=Qb.y;ra[J+6]=Qb.z;ra[J+7]=1;ra[J+8]=Rb.x;ra[J+9]=Rb.y;ra[J+10]=Rb.z;ra[J+11]=1;ra[J+12]=Gc.x;ra[J+13]=Gc.y;ra[J+14]=Gc.z;ra[J+15]=1;Sb=fc[K.a];Tb=fc[K.b];Ub=fc[K.c];Hc=fc[K.d];sa[J]=Sb.x;sa[J+1]=Sb.y;sa[J+2]=Sb.z;sa[J+3]=1;sa[J+4]=Tb.x;sa[J+5]=Tb.y;sa[J+6]=Tb.z;sa[J+7]=1;sa[J+8]=Ub.x;sa[J+9]=Ub.y;sa[J+10]=Ub.z;sa[J+11]=1;sa[J+12]=Hc.x;sa[J+13]=Hc.y;sa[J+14]=Hc.z;sa[J+15]=1;J=J+16}if(J>0){i.bindBuffer(i.ARRAY_BUFFER,da.__webglSkinVertexABuffer);i.bufferData(i.ARRAY_BUFFER,
ra,Wa);i.bindBuffer(i.ARRAY_BUFFER,da.__webglSkinVertexBBuffer);i.bufferData(i.ARRAY_BUFFER,sa,Wa);i.bindBuffer(i.ARRAY_BUFFER,da.__webglSkinIndicesBuffer);i.bufferData(i.ARRAY_BUFFER,ta,Wa);i.bindBuffer(i.ARRAY_BUFFER,da.__webglSkinWeightsBuffer);i.bufferData(i.ARRAY_BUFFER,ua,Wa)}}if(rd&&Sc){F=0;for(T=ja.length;F<T;F++){K=Aa[ja[F]];lb=K.vertexColors;Fc=K.color;if(lb.length===3&&Sc===THREE.VertexColors){vb=lb[0];wb=lb[1];xb=lb[2]}else xb=wb=vb=Fc;Ia[za]=vb.r;Ia[za+1]=vb.g;Ia[za+2]=vb.b;Ia[za+3]=
wb.r;Ia[za+4]=wb.g;Ia[za+5]=wb.b;Ia[za+6]=xb.r;Ia[za+7]=xb.g;Ia[za+8]=xb.b;za=za+9}F=0;for(T=ka.length;F<T;F++){K=Aa[ka[F]];lb=K.vertexColors;Fc=K.color;if(lb.length===4&&Sc===THREE.VertexColors){vb=lb[0];wb=lb[1];xb=lb[2];sc=lb[3]}else sc=xb=wb=vb=Fc;Ia[za]=vb.r;Ia[za+1]=vb.g;Ia[za+2]=vb.b;Ia[za+3]=wb.r;Ia[za+4]=wb.g;Ia[za+5]=wb.b;Ia[za+6]=xb.r;Ia[za+7]=xb.g;Ia[za+8]=xb.b;Ia[za+9]=sc.r;Ia[za+10]=sc.g;Ia[za+11]=sc.b;za=za+12}if(za>0){i.bindBuffer(i.ARRAY_BUFFER,da.__webglColorBuffer);i.bufferData(i.ARRAY_BUFFER,
Ia,Wa)}}if(qd&&Ra.hasTangents){F=0;for(T=ja.length;F<T;F++){K=Aa[ja[F]];Gb=K.vertexTangents;pb=Gb[0];qb=Gb[1];rb=Gb[2];qa[na]=pb.x;qa[na+1]=pb.y;qa[na+2]=pb.z;qa[na+3]=pb.w;qa[na+4]=qb.x;qa[na+5]=qb.y;qa[na+6]=qb.z;qa[na+7]=qb.w;qa[na+8]=rb.x;qa[na+9]=rb.y;qa[na+10]=rb.z;qa[na+11]=rb.w;na=na+12}F=0;for(T=ka.length;F<T;F++){K=Aa[ka[F]];Gb=K.vertexTangents;pb=Gb[0];qb=Gb[1];rb=Gb[2];qc=Gb[3];qa[na]=pb.x;qa[na+1]=pb.y;qa[na+2]=pb.z;qa[na+3]=pb.w;qa[na+4]=qb.x;qa[na+5]=qb.y;qa[na+6]=qb.z;qa[na+7]=qb.w;
qa[na+8]=rb.x;qa[na+9]=rb.y;qa[na+10]=rb.z;qa[na+11]=rb.w;qa[na+12]=qc.x;qa[na+13]=qc.y;qa[na+14]=qc.z;qa[na+15]=qc.w;na=na+16}i.bindBuffer(i.ARRAY_BUFFER,da.__webglTangentBuffer);i.bufferData(i.ARRAY_BUFFER,qa,Wa)}if(pd&&bd){F=0;for(T=ja.length;F<T;F++){K=Aa[ja[F]];jc=K.vertexNormals;Ob=K.normal;if(jc.length===3&&Ec)for(ia=0;ia<3;ia++){Vb=jc[ia];db[Na]=Vb.x;db[Na+1]=Vb.y;db[Na+2]=Vb.z;Na=Na+3}else for(ia=0;ia<3;ia++){db[Na]=Ob.x;db[Na+1]=Ob.y;db[Na+2]=Ob.z;Na=Na+3}}F=0;for(T=ka.length;F<T;F++){K=
Aa[ka[F]];jc=K.vertexNormals;Ob=K.normal;if(jc.length===4&&Ec)for(ia=0;ia<4;ia++){Vb=jc[ia];db[Na]=Vb.x;db[Na+1]=Vb.y;db[Na+2]=Vb.z;Na=Na+3}else for(ia=0;ia<4;ia++){db[Na]=Ob.x;db[Na+1]=Ob.y;db[Na+2]=Ob.z;Na=Na+3}}i.bindBuffer(i.ARRAY_BUFFER,da.__webglNormalBuffer);i.bufferData(i.ARRAY_BUFFER,db,Wa)}if(fd&&Wc&&cd){F=0;for(T=ja.length;F<T;F++){ib=ja[F];K=Aa[ib];kc=Wc[ib];if(kc!==void 0)for(ia=0;ia<3;ia++){mc=kc[ia];vc[Ib]=mc.u;vc[Ib+1]=mc.v;Ib=Ib+2}}F=0;for(T=ka.length;F<T;F++){ib=ka[F];K=Aa[ib];kc=
Wc[ib];if(kc!==void 0)for(ia=0;ia<4;ia++){mc=kc[ia];vc[Ib]=mc.u;vc[Ib+1]=mc.v;Ib=Ib+2}}if(Ib>0){i.bindBuffer(i.ARRAY_BUFFER,da.__webglUVBuffer);i.bufferData(i.ARRAY_BUFFER,vc,Wa)}}if(fd&&Xc&&cd){F=0;for(T=ja.length;F<T;F++){ib=ja[F];K=Aa[ib];lc=Xc[ib];if(lc!==void 0)for(ia=0;ia<3;ia++){nc=lc[ia];wc[Jb]=nc.u;wc[Jb+1]=nc.v;Jb=Jb+2}}F=0;for(T=ka.length;F<T;F++){ib=ka[F];K=Aa[ib];lc=Xc[ib];if(lc!==void 0)for(ia=0;ia<4;ia++){nc=lc[ia];wc[Jb]=nc.u;wc[Jb+1]=nc.v;Jb=Jb+2}}if(Jb>0){i.bindBuffer(i.ARRAY_BUFFER,
da.__webglUV2Buffer);i.bufferData(i.ARRAY_BUFFER,wc,Wa)}}if(od){F=0;for(T=ja.length;F<T;F++){K=Aa[ja[F]];Eb[cb]=xa;Eb[cb+1]=xa+1;Eb[cb+2]=xa+2;cb=cb+3;Ya[Qa]=xa;Ya[Qa+1]=xa+1;Ya[Qa+2]=xa;Ya[Qa+3]=xa+2;Ya[Qa+4]=xa+1;Ya[Qa+5]=xa+2;Qa=Qa+6;xa=xa+3}F=0;for(T=ka.length;F<T;F++){K=Aa[ka[F]];Eb[cb]=xa;Eb[cb+1]=xa+1;Eb[cb+2]=xa+3;Eb[cb+3]=xa+1;Eb[cb+4]=xa+2;Eb[cb+5]=xa+3;cb=cb+6;Ya[Qa]=xa;Ya[Qa+1]=xa+1;Ya[Qa+2]=xa;Ya[Qa+3]=xa+3;Ya[Qa+4]=xa+1;Ya[Qa+5]=xa+2;Ya[Qa+6]=xa+2;Ya[Qa+7]=xa+3;Qa=Qa+8;xa=xa+4}i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,
da.__webglFaceBuffer);i.bufferData(i.ELEMENT_ARRAY_BUFFER,Eb,Wa);i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,da.__webglLineBuffer);i.bufferData(i.ELEMENT_ARRAY_BUFFER,Ya,Wa)}if(Vc){ia=0;for(dd=Vc.length;ia<dd;ia++){w=Vc[ia];if(w.__original.needsUpdate){z=0;if(w.size===1)if(w.boundTo===void 0||w.boundTo==="vertices"){F=0;for(T=ja.length;F<T;F++){K=Aa[ja[F]];w.array[z]=w.value[K.a];w.array[z+1]=w.value[K.b];w.array[z+2]=w.value[K.c];z=z+3}F=0;for(T=ka.length;F<T;F++){K=Aa[ka[F]];w.array[z]=w.value[K.a];w.array[z+
1]=w.value[K.b];w.array[z+2]=w.value[K.c];w.array[z+3]=w.value[K.d];z=z+4}}else{if(w.boundTo==="faces"){F=0;for(T=ja.length;F<T;F++){Xa=w.value[ja[F]];w.array[z]=Xa;w.array[z+1]=Xa;w.array[z+2]=Xa;z=z+3}F=0;for(T=ka.length;F<T;F++){Xa=w.value[ka[F]];w.array[z]=Xa;w.array[z+1]=Xa;w.array[z+2]=Xa;w.array[z+3]=Xa;z=z+4}}}else if(w.size===2)if(w.boundTo===void 0||w.boundTo==="vertices"){F=0;for(T=ja.length;F<T;F++){K=Aa[ja[F]];V=w.value[K.a];W=w.value[K.b];X=w.value[K.c];w.array[z]=V.x;w.array[z+1]=V.y;
w.array[z+2]=W.x;w.array[z+3]=W.y;w.array[z+4]=X.x;w.array[z+5]=X.y;z=z+6}F=0;for(T=ka.length;F<T;F++){K=Aa[ka[F]];V=w.value[K.a];W=w.value[K.b];X=w.value[K.c];ma=w.value[K.d];w.array[z]=V.x;w.array[z+1]=V.y;w.array[z+2]=W.x;w.array[z+3]=W.y;w.array[z+4]=X.x;w.array[z+5]=X.y;w.array[z+6]=ma.x;w.array[z+7]=ma.y;z=z+8}}else{if(w.boundTo==="faces"){F=0;for(T=ja.length;F<T;F++){X=W=V=Xa=w.value[ja[F]];w.array[z]=V.x;w.array[z+1]=V.y;w.array[z+2]=W.x;w.array[z+3]=W.y;w.array[z+4]=X.x;w.array[z+5]=X.y;
z=z+6}F=0;for(T=ka.length;F<T;F++){ma=X=W=V=Xa=w.value[ka[F]];w.array[z]=V.x;w.array[z+1]=V.y;w.array[z+2]=W.x;w.array[z+3]=W.y;w.array[z+4]=X.x;w.array[z+5]=X.y;w.array[z+6]=ma.x;w.array[z+7]=ma.y;z=z+8}}}else if(w.size===3){var ea;ea=w.type==="c"?["r","g","b"]:["x","y","z"];if(w.boundTo===void 0||w.boundTo==="vertices"){F=0;for(T=ja.length;F<T;F++){K=Aa[ja[F]];V=w.value[K.a];W=w.value[K.b];X=w.value[K.c];w.array[z]=V[ea[0]];w.array[z+1]=V[ea[1]];w.array[z+2]=V[ea[2]];w.array[z+3]=W[ea[0]];w.array[z+
4]=W[ea[1]];w.array[z+5]=W[ea[2]];w.array[z+6]=X[ea[0]];w.array[z+7]=X[ea[1]];w.array[z+8]=X[ea[2]];z=z+9}F=0;for(T=ka.length;F<T;F++){K=Aa[ka[F]];V=w.value[K.a];W=w.value[K.b];X=w.value[K.c];ma=w.value[K.d];w.array[z]=V[ea[0]];w.array[z+1]=V[ea[1]];w.array[z+2]=V[ea[2]];w.array[z+3]=W[ea[0]];w.array[z+4]=W[ea[1]];w.array[z+5]=W[ea[2]];w.array[z+6]=X[ea[0]];w.array[z+7]=X[ea[1]];w.array[z+8]=X[ea[2]];w.array[z+9]=ma[ea[0]];w.array[z+10]=ma[ea[1]];w.array[z+11]=ma[ea[2]];z=z+12}}else if(w.boundTo===
"faces"){F=0;for(T=ja.length;F<T;F++){X=W=V=Xa=w.value[ja[F]];w.array[z]=V[ea[0]];w.array[z+1]=V[ea[1]];w.array[z+2]=V[ea[2]];w.array[z+3]=W[ea[0]];w.array[z+4]=W[ea[1]];w.array[z+5]=W[ea[2]];w.array[z+6]=X[ea[0]];w.array[z+7]=X[ea[1]];w.array[z+8]=X[ea[2]];z=z+9}F=0;for(T=ka.length;F<T;F++){ma=X=W=V=Xa=w.value[ka[F]];w.array[z]=V[ea[0]];w.array[z+1]=V[ea[1]];w.array[z+2]=V[ea[2]];w.array[z+3]=W[ea[0]];w.array[z+4]=W[ea[1]];w.array[z+5]=W[ea[2]];w.array[z+6]=X[ea[0]];w.array[z+7]=X[ea[1]];w.array[z+
8]=X[ea[2]];w.array[z+9]=ma[ea[0]];w.array[z+10]=ma[ea[1]];w.array[z+11]=ma[ea[2]];z=z+12}}}else if(w.size===4)if(w.boundTo===void 0||w.boundTo==="vertices"){F=0;for(T=ja.length;F<T;F++){K=Aa[ja[F]];V=w.value[K.a];W=w.value[K.b];X=w.value[K.c];w.array[z]=V.x;w.array[z+1]=V.y;w.array[z+2]=V.z;w.array[z+3]=V.w;w.array[z+4]=W.x;w.array[z+5]=W.y;w.array[z+6]=W.z;w.array[z+7]=W.w;w.array[z+8]=X.x;w.array[z+9]=X.y;w.array[z+10]=X.z;w.array[z+11]=X.w;z=z+12}F=0;for(T=ka.length;F<T;F++){K=Aa[ka[F]];V=w.value[K.a];
W=w.value[K.b];X=w.value[K.c];ma=w.value[K.d];w.array[z]=V.x;w.array[z+1]=V.y;w.array[z+2]=V.z;w.array[z+3]=V.w;w.array[z+4]=W.x;w.array[z+5]=W.y;w.array[z+6]=W.z;w.array[z+7]=W.w;w.array[z+8]=X.x;w.array[z+9]=X.y;w.array[z+10]=X.z;w.array[z+11]=X.w;w.array[z+12]=ma.x;w.array[z+13]=ma.y;w.array[z+14]=ma.z;w.array[z+15]=ma.w;z=z+16}}else if(w.boundTo==="faces"){F=0;for(T=ja.length;F<T;F++){X=W=V=Xa=w.value[ja[F]];w.array[z]=V.x;w.array[z+1]=V.y;w.array[z+2]=V.z;w.array[z+3]=V.w;w.array[z+4]=W.x;w.array[z+
5]=W.y;w.array[z+6]=W.z;w.array[z+7]=W.w;w.array[z+8]=X.x;w.array[z+9]=X.y;w.array[z+10]=X.z;w.array[z+11]=X.w;z=z+12}F=0;for(T=ka.length;F<T;F++){ma=X=W=V=Xa=w.value[ka[F]];w.array[z]=V.x;w.array[z+1]=V.y;w.array[z+2]=V.z;w.array[z+3]=V.w;w.array[z+4]=W.x;w.array[z+5]=W.y;w.array[z+6]=W.z;w.array[z+7]=W.w;w.array[z+8]=X.x;w.array[z+9]=X.y;w.array[z+10]=X.z;w.array[z+11]=X.w;w.array[z+12]=ma.x;w.array[z+13]=ma.y;w.array[z+14]=ma.z;w.array[z+15]=ma.w;z=z+16}}i.bindBuffer(i.ARRAY_BUFFER,w.buffer);i.bufferData(i.ARRAY_BUFFER,
w.array,Wa)}}}if(nd){delete da.__inittedArrays;delete da.__colorArray;delete da.__normalArray;delete da.__tangentArray;delete da.__uvArray;delete da.__uv2Array;delete da.__faceArray;delete da.__vertexArray;delete da.__lineArray;delete da.__skinVertexAArray;delete da.__skinVertexBArray;delete da.__skinIndexArray;delete da.__skinWeightArray}}}}ga.verticesNeedUpdate=false;ga.morphTargetsNeedUpdate=false;ga.elementsNeedUpdate=false;ga.uvsNeedUpdate=false;ga.normalsNeedUpdate=false;ga.colorsNeedUpdate=
false;ga.tangetsNeedUpdate=false;Ua.attributes&&p(Ua)}else if(kb instanceof THREE.Ribbon){if(ga.verticesNeedUpdate||ga.colorsNeedUpdate){var Zb=ga,gd=i.DYNAMIC_DRAW,xc=void 0,yc=void 0,Jc=void 0,$b=void 0,Kc=void 0,hd=Zb.vertices,id=Zb.colors,td=hd.length,ud=id.length,Lc=Zb.__vertexArray,Mc=Zb.__colorArray,vd=Zb.colorsNeedUpdate;if(Zb.verticesNeedUpdate){for(xc=0;xc<td;xc++){Jc=hd[xc];$b=xc*3;Lc[$b]=Jc.x;Lc[$b+1]=Jc.y;Lc[$b+2]=Jc.z}i.bindBuffer(i.ARRAY_BUFFER,Zb.__webglVertexBuffer);i.bufferData(i.ARRAY_BUFFER,
Lc,gd)}if(vd){for(yc=0;yc<ud;yc++){Kc=id[yc];$b=yc*3;Mc[$b]=Kc.r;Mc[$b+1]=Kc.g;Mc[$b+2]=Kc.b}i.bindBuffer(i.ARRAY_BUFFER,Zb.__webglColorBuffer);i.bufferData(i.ARRAY_BUFFER,Mc,gd)}}ga.verticesNeedUpdate=false;ga.colorsNeedUpdate=false}else if(kb instanceof THREE.Line){Ua=c(kb,$a);fb=Ua.attributes&&m(Ua);if(ga.verticesNeedUpdate||ga.colorsNeedUpdate||fb){var Kb=ga,Yc=i.DYNAMIC_DRAW,zc=void 0,Ac=void 0,Nc=void 0,va=void 0,Oc=void 0,jd=Kb.vertices,kd=Kb.colors,wd=jd.length,xd=kd.length,Pc=Kb.__vertexArray,
Qc=Kb.__colorArray,yd=Kb.colorsNeedUpdate,Zc=Kb.__webglCustomAttributesList,Rc=void 0,ld=void 0,La=void 0,oc=void 0,Va=void 0,pa=void 0;if(Kb.verticesNeedUpdate){for(zc=0;zc<wd;zc++){Nc=jd[zc];va=zc*3;Pc[va]=Nc.x;Pc[va+1]=Nc.y;Pc[va+2]=Nc.z}i.bindBuffer(i.ARRAY_BUFFER,Kb.__webglVertexBuffer);i.bufferData(i.ARRAY_BUFFER,Pc,Yc)}if(yd){for(Ac=0;Ac<xd;Ac++){Oc=kd[Ac];va=Ac*3;Qc[va]=Oc.r;Qc[va+1]=Oc.g;Qc[va+2]=Oc.b}i.bindBuffer(i.ARRAY_BUFFER,Kb.__webglColorBuffer);i.bufferData(i.ARRAY_BUFFER,Qc,Yc)}if(Zc){Rc=
0;for(ld=Zc.length;Rc<ld;Rc++){pa=Zc[Rc];if(pa.needsUpdate&&(pa.boundTo===void 0||pa.boundTo==="vertices")){va=0;oc=pa.value.length;if(pa.size===1)for(La=0;La<oc;La++)pa.array[La]=pa.value[La];else if(pa.size===2)for(La=0;La<oc;La++){Va=pa.value[La];pa.array[va]=Va.x;pa.array[va+1]=Va.y;va=va+2}else if(pa.size===3)if(pa.type==="c")for(La=0;La<oc;La++){Va=pa.value[La];pa.array[va]=Va.r;pa.array[va+1]=Va.g;pa.array[va+2]=Va.b;va=va+3}else for(La=0;La<oc;La++){Va=pa.value[La];pa.array[va]=Va.x;pa.array[va+
1]=Va.y;pa.array[va+2]=Va.z;va=va+3}else if(pa.size===4)for(La=0;La<oc;La++){Va=pa.value[La];pa.array[va]=Va.x;pa.array[va+1]=Va.y;pa.array[va+2]=Va.z;pa.array[va+3]=Va.w;va=va+4}i.bindBuffer(i.ARRAY_BUFFER,pa.buffer);i.bufferData(i.ARRAY_BUFFER,pa.array,Yc)}}}}ga.verticesNeedUpdate=false;ga.colorsNeedUpdate=false;Ua.attributes&&p(Ua)}else if(kb instanceof THREE.ParticleSystem){Ua=c(kb,$a);fb=Ua.attributes&&m(Ua);(ga.verticesNeedUpdate||ga.colorsNeedUpdate||kb.sortParticles||fb)&&f(ga,i.DYNAMIC_DRAW,
kb);ga.verticesNeedUpdate=false;ga.colorsNeedUpdate=false;Ua.attributes&&p(Ua)}}};this.initMaterial=function(a,b,c,d){var e,f,g;a instanceof THREE.MeshDepthMaterial?g="depth":a instanceof THREE.MeshNormalMaterial?g="normal":a instanceof THREE.MeshBasicMaterial?g="basic":a instanceof THREE.MeshLambertMaterial?g="lambert":a instanceof THREE.MeshPhongMaterial?g="phong":a instanceof THREE.LineBasicMaterial?g="basic":a instanceof THREE.ParticleBasicMaterial&&(g="particle_basic");if(g){var h=THREE.ShaderLib[g];
a.uniforms=THREE.UniformsUtils.clone(h.uniforms);a.vertexShader=h.vertexShader;a.fragmentShader=h.fragmentShader}var j,k,l,m,n;j=m=n=h=0;for(k=b.length;j<k;j++){l=b[j];if(!l.onlyShadow){l instanceof THREE.DirectionalLight&&m++;l instanceof THREE.PointLight&&n++;l instanceof THREE.SpotLight&&h++}}if(n+h+m<=Q){k=m;l=n;m=h}else{k=Math.ceil(Q*m/(n+m));m=l=Q-k}var o=0,h=0;for(n=b.length;h<n;h++){j=b[h];if(j.castShadow){j instanceof THREE.SpotLight&&o++;j instanceof THREE.DirectionalLight&&!j.shadowCascade&&
o++}}var p=50;if(d!==void 0&&d instanceof THREE.SkinnedMesh)p=d.bones.length;var r;a:{j=a.fragmentShader;n=a.vertexShader;var h=a.uniforms,b=a.attributes,c={map:!!a.map,envMap:!!a.envMap,lightMap:!!a.lightMap,vertexColors:a.vertexColors,fog:c,useFog:a.fog,sizeAttenuation:a.sizeAttenuation,skinning:a.skinning,maxBones:p,morphTargets:a.morphTargets,morphNormals:a.morphNormals,maxMorphTargets:this.maxMorphTargets,maxMorphNormals:this.maxMorphNormals,maxDirLights:k,maxPointLights:l,maxSpotLights:m,maxShadows:o,
shadowMapEnabled:this.shadowMapEnabled&&d.receiveShadow,shadowMapSoft:this.shadowMapSoft,shadowMapDebug:this.shadowMapDebug,shadowMapCascade:this.shadowMapCascade,alphaTest:a.alphaTest,metal:a.metal,perPixel:a.perPixel,wrapAround:a.wrapAround,doubleSided:d&&d.doubleSided},q,d=[];if(g)d.push(g);else{d.push(j);d.push(n)}for(q in c){d.push(q);d.push(c[q])}g=d.join();q=0;for(d=P.length;q<d;q++){k=P[q];if(k.code===g){k.usedTimes++;r=k.program;break a}}q=i.createProgram();d=["precision "+v+" float;",$a>
0?"#define VERTEX_TEXTURES":"",C.gammaInput?"#define GAMMA_INPUT":"",C.gammaOutput?"#define GAMMA_OUTPUT":"",C.physicallyBasedShading?"#define PHYSICALLY_BASED_SHADING":"","#define MAX_DIR_LIGHTS "+c.maxDirLights,"#define MAX_POINT_LIGHTS "+c.maxPointLights,"#define MAX_SPOT_LIGHTS "+c.maxSpotLights,"#define MAX_SHADOWS "+c.maxShadows,"#define MAX_BONES "+c.maxBones,c.map?"#define USE_MAP":"",c.envMap?"#define USE_ENVMAP":"",c.lightMap?"#define USE_LIGHTMAP":"",c.vertexColors?"#define USE_COLOR":
"",c.skinning?"#define USE_SKINNING":"",c.morphTargets?"#define USE_MORPHTARGETS":"",c.morphNormals?"#define USE_MORPHNORMALS":"",c.perPixel?"#define PHONG_PER_PIXEL":"",c.wrapAround?"#define WRAP_AROUND":"",c.doubleSided?"#define DOUBLE_SIDED":"",c.shadowMapEnabled?"#define USE_SHADOWMAP":"",c.shadowMapSoft?"#define SHADOWMAP_SOFT":"",c.shadowMapDebug?"#define SHADOWMAP_DEBUG":"",c.shadowMapCascade?"#define SHADOWMAP_CASCADE":"",c.sizeAttenuation?"#define USE_SIZEATTENUATION":"","uniform mat4 objectMatrix;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform mat4 viewMatrix;\nuniform mat3 normalMatrix;\nuniform vec3 cameraPosition;\nattribute vec3 position;\nattribute vec3 normal;\nattribute vec2 uv;\nattribute vec2 uv2;\n#ifdef USE_COLOR\nattribute vec3 color;\n#endif\n#ifdef USE_MORPHTARGETS\nattribute vec3 morphTarget0;\nattribute vec3 morphTarget1;\nattribute vec3 morphTarget2;\nattribute vec3 morphTarget3;\n#ifdef USE_MORPHNORMALS\nattribute vec3 morphNormal0;\nattribute vec3 morphNormal1;\nattribute vec3 morphNormal2;\nattribute vec3 morphNormal3;\n#else\nattribute vec3 morphTarget4;\nattribute vec3 morphTarget5;\nattribute vec3 morphTarget6;\nattribute vec3 morphTarget7;\n#endif\n#endif\n#ifdef USE_SKINNING\nattribute vec4 skinVertexA;\nattribute vec4 skinVertexB;\nattribute vec4 skinIndex;\nattribute vec4 skinWeight;\n#endif\n"].join("\n");
k=["precision "+v+" float;","#define MAX_DIR_LIGHTS "+c.maxDirLights,"#define MAX_POINT_LIGHTS "+c.maxPointLights,"#define MAX_SPOT_LIGHTS "+c.maxSpotLights,"#define MAX_SHADOWS "+c.maxShadows,c.alphaTest?"#define ALPHATEST "+c.alphaTest:"",C.gammaInput?"#define GAMMA_INPUT":"",C.gammaOutput?"#define GAMMA_OUTPUT":"",C.physicallyBasedShading?"#define PHYSICALLY_BASED_SHADING":"",c.useFog&&c.fog?"#define USE_FOG":"",c.useFog&&c.fog instanceof THREE.FogExp2?"#define FOG_EXP2":"",c.map?"#define USE_MAP":
"",c.envMap?"#define USE_ENVMAP":"",c.lightMap?"#define USE_LIGHTMAP":"",c.vertexColors?"#define USE_COLOR":"",c.metal?"#define METAL":"",c.perPixel?"#define PHONG_PER_PIXEL":"",c.wrapAround?"#define WRAP_AROUND":"",c.doubleSided?"#define DOUBLE_SIDED":"",c.shadowMapEnabled?"#define USE_SHADOWMAP":"",c.shadowMapSoft?"#define SHADOWMAP_SOFT":"",c.shadowMapDebug?"#define SHADOWMAP_DEBUG":"",c.shadowMapCascade?"#define SHADOWMAP_CASCADE":"","uniform mat4 viewMatrix;\nuniform vec3 cameraPosition;\n"].join("\n");
j=y("fragment",k+j);d=y("vertex",d+n);i.attachShader(q,d);i.attachShader(q,j);i.linkProgram(q);i.getProgramParameter(q,i.LINK_STATUS)||console.error("Could not initialise shader\nVALIDATE_STATUS: "+i.getProgramParameter(q,i.VALIDATE_STATUS)+", gl error ["+i.getError()+"]");i.deleteShader(j);i.deleteShader(d);q.uniforms={};q.attributes={};var s,d=["viewMatrix","modelViewMatrix","projectionMatrix","normalMatrix","objectMatrix","cameraPosition","boneGlobalMatrices","morphTargetInfluences"];for(s in h)d.push(s);
s=d;d=0;for(h=s.length;d<h;d++){n=s[d];q.uniforms[n]=i.getUniformLocation(q,n)}d=["position","normal","uv","uv2","tangent","color","skinVertexA","skinVertexB","skinIndex","skinWeight"];for(s=0;s<c.maxMorphTargets;s++)d.push("morphTarget"+s);for(s=0;s<c.maxMorphNormals;s++)d.push("morphNormal"+s);for(r in b)d.push(r);r=d;s=0;for(b=r.length;s<b;s++){c=r[s];q.attributes[c]=i.getAttribLocation(q,c)}q.id=L++;P.push({program:q,code:g,usedTimes:1});C.info.memory.programs=P.length;r=q}a.program=r;r=a.program.attributes;
r.position>=0&&i.enableVertexAttribArray(r.position);r.color>=0&&i.enableVertexAttribArray(r.color);r.normal>=0&&i.enableVertexAttribArray(r.normal);r.tangent>=0&&i.enableVertexAttribArray(r.tangent);if(a.skinning&&r.skinVertexA>=0&&r.skinVertexB>=0&&r.skinIndex>=0&&r.skinWeight>=0){i.enableVertexAttribArray(r.skinVertexA);i.enableVertexAttribArray(r.skinVertexB);i.enableVertexAttribArray(r.skinIndex);i.enableVertexAttribArray(r.skinWeight)}if(a.attributes)for(f in a.attributes)r[f]!==void 0&&r[f]>=
0&&i.enableVertexAttribArray(r[f]);if(a.morphTargets){a.numSupportedMorphTargets=0;b="morphTarget";for(f=0;f<this.maxMorphTargets;f++){s=b+f;if(r[s]>=0){i.enableVertexAttribArray(r[s]);a.numSupportedMorphTargets++}}}if(a.morphNormals){a.numSupportedMorphNormals=0;b="morphNormal";for(f=0;f<this.maxMorphNormals;f++){s=b+f;if(r[s]>=0){i.enableVertexAttribArray(r[s]);a.numSupportedMorphNormals++}}}a.uniformsList=[];for(e in a.uniforms)a.uniformsList.push([a.uniforms[e],e])};this.setFaceCulling=function(a,
b){if(a){!b||b==="ccw"?i.frontFace(i.CCW):i.frontFace(i.CW);a==="back"?i.cullFace(i.BACK):a==="front"?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK);i.enable(i.CULL_FACE)}else i.disable(i.CULL_FACE)};this.setObjectFaces=function(a){if($!==a.doubleSided){a.doubleSided?i.disable(i.CULL_FACE):i.enable(i.CULL_FACE);$=a.doubleSided}if(U!==a.flipSided){a.flipSided?i.frontFace(i.CW):i.frontFace(i.CCW);U=a.flipSided}};this.setDepthTest=function(a){if(Oa!==a){a?i.enable(i.DEPTH_TEST):i.disable(i.DEPTH_TEST);
Oa=a}};this.setDepthWrite=function(a){if(oa!==a){i.depthMask(a);oa=a}};this.setBlending=function(a,b,c,d){if(a!==Y){switch(a){case THREE.NoBlending:i.disable(i.BLEND);break;case THREE.AdditiveBlending:i.enable(i.BLEND);i.blendEquation(i.FUNC_ADD);i.blendFunc(i.SRC_ALPHA,i.ONE);break;case THREE.SubtractiveBlending:i.enable(i.BLEND);i.blendEquation(i.FUNC_ADD);i.blendFunc(i.ZERO,i.ONE_MINUS_SRC_COLOR);break;case THREE.MultiplyBlending:i.enable(i.BLEND);i.blendEquation(i.FUNC_ADD);i.blendFunc(i.ZERO,
i.SRC_COLOR);break;case THREE.CustomBlending:i.enable(i.BLEND);break;default:i.enable(i.BLEND);i.blendEquationSeparate(i.FUNC_ADD,i.FUNC_ADD);i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA)}Y=a}if(a===THREE.CustomBlending){if(b!==ha){i.blendEquation(D(b));ha=b}if(c!==Sa||d!==Ma){i.blendFunc(D(c),D(d));Sa=c;Ma=d}}else Ma=Sa=ha=null};this.setTexture=function(a,b){if(a.needsUpdate){if(!a.__webglInit){a.__webglInit=true;a.__webglTexture=i.createTexture();C.info.memory.textures++}i.activeTexture(i.TEXTURE0+
b);i.bindTexture(i.TEXTURE_2D,a.__webglTexture);i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,a.premultiplyAlpha);var c=a.image,d=(c.width&c.width-1)===0&&(c.height&c.height-1)===0,e=D(a.format),f=D(a.type);s(i.TEXTURE_2D,a,d);a instanceof THREE.DataTexture?i.texImage2D(i.TEXTURE_2D,0,e,c.width,c.height,0,e,f,c.data):i.texImage2D(i.TEXTURE_2D,0,e,e,f,a.image);a.generateMipmaps&&d&&i.generateMipmap(i.TEXTURE_2D);a.needsUpdate=false;if(a.onUpdate)a.onUpdate()}else{i.activeTexture(i.TEXTURE0+b);i.bindTexture(i.TEXTURE_2D,
a.__webglTexture)}};this.setRenderTarget=function(a){var b=a instanceof THREE.WebGLRenderTargetCube;if(a&&!a.__webglFramebuffer){if(a.depthBuffer===void 0)a.depthBuffer=true;if(a.stencilBuffer===void 0)a.stencilBuffer=true;a.__webglTexture=i.createTexture();var c=(a.width&a.width-1)===0&&(a.height&a.height-1)===0,d=D(a.format),e=D(a.type);if(b){a.__webglFramebuffer=[];a.__webglRenderbuffer=[];i.bindTexture(i.TEXTURE_CUBE_MAP,a.__webglTexture);s(i.TEXTURE_CUBE_MAP,a,c);for(var f=0;f<6;f++){a.__webglFramebuffer[f]=
i.createFramebuffer();a.__webglRenderbuffer[f]=i.createRenderbuffer();i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+f,0,d,a.width,a.height,0,d,e,null);var g=a,h=i.TEXTURE_CUBE_MAP_POSITIVE_X+f;i.bindFramebuffer(i.FRAMEBUFFER,a.__webglFramebuffer[f]);i.framebufferTexture2D(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0,h,g.__webglTexture,0);x(a.__webglRenderbuffer[f],a)}c&&i.generateMipmap(i.TEXTURE_CUBE_MAP)}else{a.__webglFramebuffer=i.createFramebuffer();a.__webglRenderbuffer=i.createRenderbuffer();i.bindTexture(i.TEXTURE_2D,
a.__webglTexture);s(i.TEXTURE_2D,a,c);i.texImage2D(i.TEXTURE_2D,0,d,a.width,a.height,0,d,e,null);d=i.TEXTURE_2D;i.bindFramebuffer(i.FRAMEBUFFER,a.__webglFramebuffer);i.framebufferTexture2D(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0,d,a.__webglTexture,0);x(a.__webglRenderbuffer,a);c&&i.generateMipmap(i.TEXTURE_2D)}b?i.bindTexture(i.TEXTURE_CUBE_MAP,null):i.bindTexture(i.TEXTURE_2D,null);i.bindRenderbuffer(i.RENDERBUFFER,null);i.bindFramebuffer(i.FRAMEBUFFER,null)}if(a){b=b?a.__webglFramebuffer[a.activeCubeFace]:
a.__webglFramebuffer;c=a.width;a=a.height;e=d=0}else{b=null;c=jb;a=nb;d=Lb;e=mb}if(b!==aa){i.bindFramebuffer(i.FRAMEBUFFER,b);i.viewport(d,e,c,a);aa=b}ab=c;Ba=a};this.shadowMapPlugin=new THREE.ShadowMapPlugin;this.addPrePlugin(this.shadowMapPlugin);this.addPostPlugin(new THREE.SpritePlugin);this.addPostPlugin(new THREE.LensFlarePlugin)};
THREE.WebGLRenderTarget=function(a,b,c){this.width=a;this.height=b;c=c||{};this.wrapS=c.wrapS!==void 0?c.wrapS:THREE.ClampToEdgeWrapping;this.wrapT=c.wrapT!==void 0?c.wrapT:THREE.ClampToEdgeWrapping;this.magFilter=c.magFilter!==void 0?c.magFilter:THREE.LinearFilter;this.minFilter=c.minFilter!==void 0?c.minFilter:THREE.LinearMipMapLinearFilter;this.offset=new THREE.Vector2(0,0);this.repeat=new THREE.Vector2(1,1);this.format=c.format!==void 0?c.format:THREE.RGBAFormat;this.type=c.type!==void 0?c.type:
THREE.UnsignedByteType;this.depthBuffer=c.depthBuffer!==void 0?c.depthBuffer:true;this.stencilBuffer=c.stencilBuffer!==void 0?c.stencilBuffer:true;this.generateMipmaps=true};
THREE.WebGLRenderTarget.prototype.clone=function(){var a=new THREE.WebGLRenderTarget(this.width,this.height);a.wrapS=this.wrapS;a.wrapT=this.wrapT;a.magFilter=this.magFilter;a.minFilter=this.minFilter;a.offset.copy(this.offset);a.repeat.copy(this.repeat);a.format=this.format;a.type=this.type;a.depthBuffer=this.depthBuffer;a.stencilBuffer=this.stencilBuffer;return a};THREE.WebGLRenderTargetCube=function(a,b,c){THREE.WebGLRenderTarget.call(this,a,b,c);this.activeCubeFace=0};
THREE.WebGLRenderTargetCube.prototype=new THREE.WebGLRenderTarget;THREE.WebGLRenderTargetCube.prototype.constructor=THREE.WebGLRenderTargetCube;THREE.RenderableVertex=function(){this.positionWorld=new THREE.Vector3;this.positionScreen=new THREE.Vector4;this.visible=true};THREE.RenderableVertex.prototype.copy=function(a){this.positionWorld.copy(a.positionWorld);this.positionScreen.copy(a.positionScreen)};
THREE.RenderableFace3=function(){this.v1=new THREE.RenderableVertex;this.v2=new THREE.RenderableVertex;this.v3=new THREE.RenderableVertex;this.centroidWorld=new THREE.Vector3;this.centroidScreen=new THREE.Vector3;this.normalWorld=new THREE.Vector3;this.vertexNormalsWorld=[new THREE.Vector3,new THREE.Vector3,new THREE.Vector3];this.faceMaterial=this.material=null;this.uvs=[[]];this.z=null};
THREE.RenderableFace4=function(){this.v1=new THREE.RenderableVertex;this.v2=new THREE.RenderableVertex;this.v3=new THREE.RenderableVertex;this.v4=new THREE.RenderableVertex;this.centroidWorld=new THREE.Vector3;this.centroidScreen=new THREE.Vector3;this.normalWorld=new THREE.Vector3;this.vertexNormalsWorld=[new THREE.Vector3,new THREE.Vector3,new THREE.Vector3,new THREE.Vector3];this.faceMaterial=this.material=null;this.uvs=[[]];this.z=null};THREE.RenderableObject=function(){this.z=this.object=null};
THREE.RenderableParticle=function(){this.rotation=this.z=this.y=this.x=null;this.scale=new THREE.Vector2;this.material=null};THREE.RenderableLine=function(){this.z=null;this.v1=new THREE.RenderableVertex;this.v2=new THREE.RenderableVertex;this.material=null};
THREE.ColorUtils={adjustHSV:function(a,b,c,d){var e=THREE.ColorUtils.__hsv;THREE.ColorUtils.rgbToHsv(a,e);e.h=THREE.Math.clamp(e.h+b,0,1);e.s=THREE.Math.clamp(e.s+c,0,1);e.v=THREE.Math.clamp(e.v+d,0,1);a.setHSV(e.h,e.s,e.v)},rgbToHsv:function(a,b){var c=a.r,d=a.g,e=a.b,f=Math.max(Math.max(c,d),e),g=Math.min(Math.min(c,d),e);if(g===f)g=c=0;else{var h=f-g,g=h/f,c=(c===f?(d-e)/h:d===f?2+(e-c)/h:4+(c-d)/h)/6;c<0&&(c=c+1);c>1&&(c=c-1)}b===void 0&&(b={h:0,s:0,v:0});b.h=c;b.s=g;b.v=f;return b}};
THREE.ColorUtils.__hsv={h:0,s:0,v:0};
THREE.GeometryUtils={merge:function(a,b){for(var c,d,e=a.vertices.length,f=b instanceof THREE.Mesh?b.geometry:b,g=a.vertices,h=f.vertices,j=a.faces,k=f.faces,l=a.faceVertexUvs[0],o=f.faceVertexUvs[0],m={},p=0;p<a.materials.length;p++)m[a.materials[p].id]=p;if(b instanceof THREE.Mesh){b.matrixAutoUpdate&&b.updateMatrix();c=b.matrix;d=new THREE.Matrix4;d.extractRotation(c,b.scale)}for(var p=0,r=h.length;p<r;p++){var n=h[p].clone();c&&c.multiplyVector3(n);g.push(n)}p=0;for(r=k.length;p<r;p++){var g=
k[p],q,u,t=g.vertexNormals,y=g.vertexColors;g instanceof THREE.Face3?q=new THREE.Face3(g.a+e,g.b+e,g.c+e):g instanceof THREE.Face4&&(q=new THREE.Face4(g.a+e,g.b+e,g.c+e,g.d+e));q.normal.copy(g.normal);d&&d.multiplyVector3(q.normal);h=0;for(n=t.length;h<n;h++){u=t[h].clone();d&&d.multiplyVector3(u);q.vertexNormals.push(u)}q.color.copy(g.color);h=0;for(n=y.length;h<n;h++){u=y[h];q.vertexColors.push(u.clone())}if(g.materialIndex!==void 0){h=f.materials[g.materialIndex];n=h.id;y=m[n];if(y===void 0){y=
a.materials.length;m[n]=y;a.materials.push(h)}q.materialIndex=y}q.centroid.copy(g.centroid);c&&c.multiplyVector3(q.centroid);j.push(q)}p=0;for(r=o.length;p<r;p++){c=o[p];d=[];h=0;for(n=c.length;h<n;h++)d.push(new THREE.UV(c[h].u,c[h].v));l.push(d)}},clone:function(a){var b=new THREE.Geometry,c,d=a.vertices,e=a.faces,f=a.faceVertexUvs[0];if(a.materials)b.materials=a.materials.slice();a=0;for(c=d.length;a<c;a++)b.vertices.push(d[a].clone());a=0;for(c=e.length;a<c;a++)b.faces.push(e[a].clone());a=0;
for(c=f.length;a<c;a++){for(var d=f[a],e=[],g=0,h=d.length;g<h;g++)e.push(new THREE.UV(d[g].u,d[g].v));b.faceVertexUvs[0].push(e)}return b},randomPointInTriangle:function(a,b,c){var d,e,f,g=new THREE.Vector3,h=THREE.GeometryUtils.__v1;d=THREE.GeometryUtils.random();e=THREE.GeometryUtils.random();if(d+e>1){d=1-d;e=1-e}f=1-d-e;g.copy(a);g.multiplyScalar(d);h.copy(b);h.multiplyScalar(e);g.addSelf(h);h.copy(c);h.multiplyScalar(f);g.addSelf(h);return g},randomPointInFace:function(a,b,c){var d,e,f;if(a instanceof
THREE.Face3){d=b.vertices[a.a];e=b.vertices[a.b];f=b.vertices[a.c];return THREE.GeometryUtils.randomPointInTriangle(d,e,f)}if(a instanceof THREE.Face4){d=b.vertices[a.a];e=b.vertices[a.b];f=b.vertices[a.c];var b=b.vertices[a.d],g;if(c)if(a._area1&&a._area2){c=a._area1;g=a._area2}else{c=THREE.GeometryUtils.triangleArea(d,e,b);g=THREE.GeometryUtils.triangleArea(e,f,b);a._area1=c;a._area2=g}else{c=THREE.GeometryUtils.triangleArea(d,e,b);g=THREE.GeometryUtils.triangleArea(e,f,b)}return THREE.GeometryUtils.random()*
(c+g)<c?THREE.GeometryUtils.randomPointInTriangle(d,e,b):THREE.GeometryUtils.randomPointInTriangle(e,f,b)}},randomPointsInGeometry:function(a,b){function c(a){function b(c,d){if(d<c)return c;var e=c+Math.floor((d-c)/2);return k[e]>a?b(c,e-1):k[e]<a?b(e+1,d):e}return b(0,k.length-1)}var d,e,f=a.faces,g=a.vertices,h=f.length,j=0,k=[],l,o,m,p;for(e=0;e<h;e++){d=f[e];if(d instanceof THREE.Face3){l=g[d.a];o=g[d.b];m=g[d.c];d._area=THREE.GeometryUtils.triangleArea(l,o,m)}else if(d instanceof THREE.Face4){l=
g[d.a];o=g[d.b];m=g[d.c];p=g[d.d];d._area1=THREE.GeometryUtils.triangleArea(l,o,p);d._area2=THREE.GeometryUtils.triangleArea(o,m,p);d._area=d._area1+d._area2}j=j+d._area;k[e]=j}d=[];for(e=0;e<b;e++){g=THREE.GeometryUtils.random()*j;g=c(g);d[e]=THREE.GeometryUtils.randomPointInFace(f[g],a,true)}return d},triangleArea:function(a,b,c){var d,e=THREE.GeometryUtils.__v1;e.sub(a,b);d=e.length();e.sub(a,c);a=e.length();e.sub(b,c);c=e.length();b=0.5*(d+a+c);return Math.sqrt(b*(b-d)*(b-a)*(b-c))},center:function(a){a.computeBoundingBox();
var b=a.boundingBox,c=new THREE.Vector3;c.add(b.min,b.max);c.multiplyScalar(-0.5);a.applyMatrix((new THREE.Matrix4).makeTranslation(c.x,c.y,c.z));a.computeBoundingBox();return c},normalizeUVs:function(a){for(var a=a.faceVertexUvs[0],b=0,c=a.length;b<c;b++)for(var d=a[b],e=0,f=d.length;e<f;e++){if(d[e].u!==1)d[e].u=d[e].u-Math.floor(d[e].u);if(d[e].v!==1)d[e].v=d[e].v-Math.floor(d[e].v)}},triangulateQuads:function(a){var b,c,d,e,f=[],g=[],h=[];b=0;for(c=a.faceUvs.length;b<c;b++)g[b]=[];b=0;for(c=a.faceVertexUvs.length;b<
c;b++)h[b]=[];b=0;for(c=a.faces.length;b<c;b++){d=a.faces[b];if(d instanceof THREE.Face4){e=d.a;var j=d.b,k=d.c,l=d.d,o=new THREE.Face3,m=new THREE.Face3;o.color.copy(d.color);m.color.copy(d.color);o.materialIndex=d.materialIndex;m.materialIndex=d.materialIndex;o.a=e;o.b=j;o.c=l;m.a=j;m.b=k;m.c=l;if(d.vertexColors.length===4){o.vertexColors[0]=d.vertexColors[0].clone();o.vertexColors[1]=d.vertexColors[1].clone();o.vertexColors[2]=d.vertexColors[3].clone();m.vertexColors[0]=d.vertexColors[1].clone();
m.vertexColors[1]=d.vertexColors[2].clone();m.vertexColors[2]=d.vertexColors[3].clone()}f.push(o,m);d=0;for(e=a.faceVertexUvs.length;d<e;d++)if(a.faceVertexUvs[d].length){o=a.faceVertexUvs[d][b];j=o[1];k=o[2];l=o[3];o=[o[0].clone(),j.clone(),l.clone()];j=[j.clone(),k.clone(),l.clone()];h[d].push(o,j)}d=0;for(e=a.faceUvs.length;d<e;d++)if(a.faceUvs[d].length){j=a.faceUvs[d][b];g[d].push(j,j)}}else{f.push(d);d=0;for(e=a.faceUvs.length;d<e;d++)g[d].push(a.faceUvs[d]);d=0;for(e=a.faceVertexUvs.length;d<
e;d++)h[d].push(a.faceVertexUvs[d])}}a.faces=f;a.faceUvs=g;a.faceVertexUvs=h;a.computeCentroids();a.computeFaceNormals();a.computeVertexNormals();a.hasTangents&&a.computeTangents()},explode:function(a){for(var b=[],c=0,d=a.faces.length;c<d;c++){var e=b.length,f=a.faces[c];if(f instanceof THREE.Face4){var g=f.a,h=f.b,j=f.c,g=a.vertices[g],h=a.vertices[h],j=a.vertices[j],k=a.vertices[f.d];b.push(g.clone());b.push(h.clone());b.push(j.clone());b.push(k.clone());f.a=e;f.b=e+1;f.c=e+2;f.d=e+3}else{g=f.a;
h=f.b;j=f.c;g=a.vertices[g];h=a.vertices[h];j=a.vertices[j];b.push(g.clone());b.push(h.clone());b.push(j.clone());f.a=e;f.b=e+1;f.c=e+2}}a.vertices=b;delete a.__tmpVertices},tessellate:function(a,b){var c,d,e,f,g,h,j,k,l,o,m,p,r,n,q,u,t,y,s,x=[],E=[];c=0;for(d=a.faceVertexUvs.length;c<d;c++)E[c]=[];c=0;for(d=a.faces.length;c<d;c++){e=a.faces[c];if(e instanceof THREE.Face3){f=e.a;g=e.b;h=e.c;k=a.vertices[f];l=a.vertices[g];o=a.vertices[h];p=k.distanceTo(l);r=l.distanceTo(o);m=k.distanceTo(o);if(p>
b||r>b||m>b){j=a.vertices.length;y=e.clone();s=e.clone();if(p>=r&&p>=m){k=k.clone();k.lerpSelf(l,0.5);y.a=f;y.b=j;y.c=h;s.a=j;s.b=g;s.c=h;if(e.vertexNormals.length===3){f=e.vertexNormals[0].clone();f.lerpSelf(e.vertexNormals[1],0.5);y.vertexNormals[1].copy(f);s.vertexNormals[0].copy(f)}if(e.vertexColors.length===3){f=e.vertexColors[0].clone();f.lerpSelf(e.vertexColors[1],0.5);y.vertexColors[1].copy(f);s.vertexColors[0].copy(f)}e=0}else if(r>=p&&r>=m){k=l.clone();k.lerpSelf(o,0.5);y.a=f;y.b=g;y.c=
j;s.a=j;s.b=h;s.c=f;if(e.vertexNormals.length===3){f=e.vertexNormals[1].clone();f.lerpSelf(e.vertexNormals[2],0.5);y.vertexNormals[2].copy(f);s.vertexNormals[0].copy(f);s.vertexNormals[1].copy(e.vertexNormals[2]);s.vertexNormals[2].copy(e.vertexNormals[0])}if(e.vertexColors.length===3){f=e.vertexColors[1].clone();f.lerpSelf(e.vertexColors[2],0.5);y.vertexColors[2].copy(f);s.vertexColors[0].copy(f);s.vertexColors[1].copy(e.vertexColors[2]);s.vertexColors[2].copy(e.vertexColors[0])}e=1}else{k=k.clone();
k.lerpSelf(o,0.5);y.a=f;y.b=g;y.c=j;s.a=j;s.b=g;s.c=h;if(e.vertexNormals.length===3){f=e.vertexNormals[0].clone();f.lerpSelf(e.vertexNormals[2],0.5);y.vertexNormals[2].copy(f);s.vertexNormals[0].copy(f)}if(e.vertexColors.length===3){f=e.vertexColors[0].clone();f.lerpSelf(e.vertexColors[2],0.5);y.vertexColors[2].copy(f);s.vertexColors[0].copy(f)}e=2}x.push(y,s);a.vertices.push(k);f=0;for(g=a.faceVertexUvs.length;f<g;f++)if(a.faceVertexUvs[f].length){k=a.faceVertexUvs[f][c];s=k[0];h=k[1];y=k[2];if(e===
0){l=s.clone();l.lerpSelf(h,0.5);k=[s.clone(),l.clone(),y.clone()];h=[l.clone(),h.clone(),y.clone()]}else if(e===1){l=h.clone();l.lerpSelf(y,0.5);k=[s.clone(),h.clone(),l.clone()];h=[l.clone(),y.clone(),s.clone()]}else{l=s.clone();l.lerpSelf(y,0.5);k=[s.clone(),h.clone(),l.clone()];h=[l.clone(),h.clone(),y.clone()]}E[f].push(k,h)}}else{x.push(e);f=0;for(g=a.faceVertexUvs.length;f<g;f++)E[f].push(a.faceVertexUvs[f][c])}}else{f=e.a;g=e.b;h=e.c;j=e.d;k=a.vertices[f];l=a.vertices[g];o=a.vertices[h];m=
a.vertices[j];p=k.distanceTo(l);r=l.distanceTo(o);n=o.distanceTo(m);q=k.distanceTo(m);if(p>b||r>b||n>b||q>b){u=a.vertices.length;t=a.vertices.length+1;y=e.clone();s=e.clone();if(p>=r&&p>=n&&p>=q||n>=r&&n>=p&&n>=q){p=k.clone();p.lerpSelf(l,0.5);l=o.clone();l.lerpSelf(m,0.5);y.a=f;y.b=u;y.c=t;y.d=j;s.a=u;s.b=g;s.c=h;s.d=t;if(e.vertexNormals.length===4){f=e.vertexNormals[0].clone();f.lerpSelf(e.vertexNormals[1],0.5);g=e.vertexNormals[2].clone();g.lerpSelf(e.vertexNormals[3],0.5);y.vertexNormals[1].copy(f);
y.vertexNormals[2].copy(g);s.vertexNormals[0].copy(f);s.vertexNormals[3].copy(g)}if(e.vertexColors.length===4){f=e.vertexColors[0].clone();f.lerpSelf(e.vertexColors[1],0.5);g=e.vertexColors[2].clone();g.lerpSelf(e.vertexColors[3],0.5);y.vertexColors[1].copy(f);y.vertexColors[2].copy(g);s.vertexColors[0].copy(f);s.vertexColors[3].copy(g)}e=0}else{p=l.clone();p.lerpSelf(o,0.5);l=m.clone();l.lerpSelf(k,0.5);y.a=f;y.b=g;y.c=u;y.d=t;s.a=t;s.b=u;s.c=h;s.d=j;if(e.vertexNormals.length===4){f=e.vertexNormals[1].clone();
f.lerpSelf(e.vertexNormals[2],0.5);g=e.vertexNormals[3].clone();g.lerpSelf(e.vertexNormals[0],0.5);y.vertexNormals[2].copy(f);y.vertexNormals[3].copy(g);s.vertexNormals[0].copy(g);s.vertexNormals[1].copy(f)}if(e.vertexColors.length===4){f=e.vertexColors[1].clone();f.lerpSelf(e.vertexColors[2],0.5);g=e.vertexColors[3].clone();g.lerpSelf(e.vertexColors[0],0.5);y.vertexColors[2].copy(f);y.vertexColors[3].copy(g);s.vertexColors[0].copy(g);s.vertexColors[1].copy(f)}e=1}x.push(y,s);a.vertices.push(p,l);
f=0;for(g=a.faceVertexUvs.length;f<g;f++)if(a.faceVertexUvs[f].length){k=a.faceVertexUvs[f][c];s=k[0];h=k[1];y=k[2];k=k[3];if(e===0){l=s.clone();l.lerpSelf(h,0.5);o=y.clone();o.lerpSelf(k,0.5);s=[s.clone(),l.clone(),o.clone(),k.clone()];h=[l.clone(),h.clone(),y.clone(),o.clone()]}else{l=h.clone();l.lerpSelf(y,0.5);o=k.clone();o.lerpSelf(s,0.5);s=[s.clone(),h.clone(),l.clone(),o.clone()];h=[o.clone(),l.clone(),y.clone(),k.clone()]}E[f].push(s,h)}}else{x.push(e);f=0;for(g=a.faceVertexUvs.length;f<g;f++)E[f].push(a.faceVertexUvs[f][c])}}}a.faces=
x;a.faceVertexUvs=E}};THREE.GeometryUtils.random=THREE.Math.random16;THREE.GeometryUtils.__v1=new THREE.Vector3;
THREE.ImageUtils={crossOrigin:"anonymous",loadTexture:function(a,b,c){var d=new THREE.Texture(void 0,b),b=new THREE.ImageLoader;b.addEventListener("load",function(a){d.image=a.content;d.needsUpdate=true;c&&c(this)});b.crossOrigin=this.crossOrigin;b.load(a);return d},loadTextureCube:function(a,b,c){var d,e=[],f=new THREE.Texture(e,b),b=e.loadCount=0;for(d=a.length;b<d;++b){e[b]=new Image;e[b].onload=function(){e.loadCount=e.loadCount+1;if(e.loadCount===6)f.needsUpdate=true;c&&c(this)};e[b].crossOrigin=
this.crossOrigin;e[b].src=a[b]}return f},getNormalMap:function(a,b){var c=function(a){var b=Math.sqrt(a[0]*a[0]+a[1]*a[1]+a[2]*a[2]);return[a[0]/b,a[1]/b,a[2]/b]},b=b|1,d=a.width,e=a.height,f=document.createElement("canvas");f.width=d;f.height=e;var g=f.getContext("2d");g.drawImage(a,0,0);for(var h=g.getImageData(0,0,d,e).data,j=g.createImageData(d,e),k=j.data,l=0;l<d;l++)for(var o=0;o<e;o++){var m=o-1<0?0:o-1,p=o+1>e-1?e-1:o+1,r=l-1<0?0:l-1,n=l+1>d-1?d-1:l+1,q=[],u=[0,0,h[(o*d+l)*4]/255*b];q.push([-1,
0,h[(o*d+r)*4]/255*b]);q.push([-1,-1,h[(m*d+r)*4]/255*b]);q.push([0,-1,h[(m*d+l)*4]/255*b]);q.push([1,-1,h[(m*d+n)*4]/255*b]);q.push([1,0,h[(o*d+n)*4]/255*b]);q.push([1,1,h[(p*d+n)*4]/255*b]);q.push([0,1,h[(p*d+l)*4]/255*b]);q.push([-1,1,h[(p*d+r)*4]/255*b]);m=[];r=q.length;for(p=0;p<r;p++){var n=q[p],t=q[(p+1)%r],n=[n[0]-u[0],n[1]-u[1],n[2]-u[2]],t=[t[0]-u[0],t[1]-u[1],t[2]-u[2]];m.push(c([n[1]*t[2]-n[2]*t[1],n[2]*t[0]-n[0]*t[2],n[0]*t[1]-n[1]*t[0]]))}q=[0,0,0];for(p=0;p<m.length;p++){q[0]=q[0]+
m[p][0];q[1]=q[1]+m[p][1];q[2]=q[2]+m[p][2]}q[0]=q[0]/m.length;q[1]=q[1]/m.length;q[2]=q[2]/m.length;u=(o*d+l)*4;k[u]=(q[0]+1)/2*255|0;k[u+1]=(q[1]+1)/2*255|0;k[u+2]=q[2]*255|0;k[u+3]=255}g.putImageData(j,0,0);return f},generateDataTexture:function(a,b,c){for(var d=a*b,e=new Uint8Array(3*d),f=Math.floor(c.r*255),g=Math.floor(c.g*255),c=Math.floor(c.b*255),h=0;h<d;h++){e[h*3]=f;e[h*3+1]=g;e[h*3+2]=c}a=new THREE.DataTexture(e,a,b,THREE.RGBFormat);a.needsUpdate=true;return a}};
THREE.SceneUtils={showHierarchy:function(a,b){THREE.SceneUtils.traverseHierarchy(a,function(a){a.visible=b})},traverseHierarchy:function(a,b){var c,d,e=a.children.length;for(d=0;d<e;d++){c=a.children[d];b(c);THREE.SceneUtils.traverseHierarchy(c,b)}},createMultiMaterialObject:function(a,b){var c,d=b.length,e=new THREE.Object3D;for(c=0;c<d;c++){var f=new THREE.Mesh(a,b[c]);e.add(f)}return e},cloneObject:function(a){var b;if(a instanceof THREE.MorphAnimMesh){b=new THREE.MorphAnimMesh(a.geometry,a.material);
b.duration=a.duration;b.mirroredLoop=a.mirroredLoop;b.time=a.time;b.lastKeyframe=a.lastKeyframe;b.currentKeyframe=a.currentKeyframe;b.direction=a.direction;b.directionBackwards=a.directionBackwards}else if(a instanceof THREE.SkinnedMesh)b=new THREE.SkinnedMesh(a.geometry,a.material);else if(a instanceof THREE.Mesh)b=new THREE.Mesh(a.geometry,a.material);else if(a instanceof THREE.Line)b=new THREE.Line(a.geometry,a.material,a.type);else if(a instanceof THREE.Ribbon)b=new THREE.Ribbon(a.geometry,a.material);
else if(a instanceof THREE.ParticleSystem){b=new THREE.ParticleSystem(a.geometry,a.material);b.sortParticles=a.sortParticles}else if(a instanceof THREE.Particle)b=new THREE.Particle(a.material);else if(a instanceof THREE.Sprite){b=new THREE.Sprite({});b.color.copy(a.color);b.map=a.map;b.blending=a.blending;b.useScreenCoordinates=a.useScreenCoordinates;b.mergeWith3D=a.mergeWith3D;b.affectedByDistance=a.affectedByDistance;b.scaleByViewport=a.scaleByViewport;b.alignment=a.alignment;b.rotation3d.copy(a.rotation3d);
b.rotation=a.rotation;b.opacity=a.opacity;b.uvOffset.copy(a.uvOffset);b.uvScale.copy(a.uvScale)}else if(a instanceof THREE.LOD)b=new THREE.LOD;else if(a instanceof THREE.MarchingCubes){b=new THREE.MarchingCubes(a.resolution,a.material);b.field.set(a.field);b.isolation=a.isolation}else a instanceof THREE.Object3D&&(b=new THREE.Object3D);b.name=a.name;b.parent=a.parent;b.up.copy(a.up);b.position.copy(a.position);b.rotation instanceof THREE.Vector3&&b.rotation.copy(a.rotation);b.eulerOrder=a.eulerOrder;
b.scale.copy(a.scale);b.dynamic=a.dynamic;b.doubleSided=a.doubleSided;b.flipSided=a.flipSided;b.renderDepth=a.renderDepth;b.rotationAutoUpdate=a.rotationAutoUpdate;b.matrix.copy(a.matrix);b.matrixWorld.copy(a.matrixWorld);b.matrixRotationWorld.copy(a.matrixRotationWorld);b.matrixAutoUpdate=a.matrixAutoUpdate;b.matrixWorldNeedsUpdate=a.matrixWorldNeedsUpdate;b.quaternion.copy(a.quaternion);b.useQuaternion=a.useQuaternion;b.boundRadius=a.boundRadius;b.boundRadiusScale=a.boundRadiusScale;b.visible=a.visible;
b.castShadow=a.castShadow;b.receiveShadow=a.receiveShadow;b.frustumCulled=a.frustumCulled;for(var c=0;c<a.children.length;c++){var d=THREE.SceneUtils.cloneObject(a.children[c]);b.children[c]=d;d.parent=b}if(a instanceof THREE.LOD)for(c=0;c<a.LODs.length;c++)b.LODs[c]={visibleAtDistance:a.LODs[c].visibleAtDistance,object3D:b.children[c]};return b},detach:function(a,b,c){a.applyMatrix(b.matrixWorld);b.remove(a);c.add(a)},attach:function(a,b,c){var d=new THREE.Matrix4;d.getInverse(c.matrixWorld);a.applyMatrix(d);
b.remove(a);c.add(a)}};
THREE.WebGLRenderer&&(THREE.ShaderUtils={lib:{fresnel:{uniforms:{mRefractionRatio:{type:"f",value:1.02},mFresnelBias:{type:"f",value:0.1},mFresnelPower:{type:"f",value:2},mFresnelScale:{type:"f",value:1},tCube:{type:"t",value:1,texture:null}},fragmentShader:"uniform samplerCube tCube;\nvarying vec3 vReflect;\nvarying vec3 vRefract[3];\nvarying float vReflectionFactor;\nvoid main() {\nvec4 reflectedColor = textureCube( tCube, vec3( -vReflect.x, vReflect.yz ) );\nvec4 refractedColor = vec4( 1.0, 1.0, 1.0, 1.0 );\nrefractedColor.r = textureCube( tCube, vec3( -vRefract[0].x, vRefract[0].yz ) ).r;\nrefractedColor.g = textureCube( tCube, vec3( -vRefract[1].x, vRefract[1].yz ) ).g;\nrefractedColor.b = textureCube( tCube, vec3( -vRefract[2].x, vRefract[2].yz ) ).b;\nrefractedColor.a = 1.0;\ngl_FragColor = mix( refractedColor, reflectedColor, clamp( vReflectionFactor, 0.0, 1.0 ) );\n}",vertexShader:"uniform float mRefractionRatio;\nuniform float mFresnelBias;\nuniform float mFresnelScale;\nuniform float mFresnelPower;\nvarying vec3 vReflect;\nvarying vec3 vRefract[3];\nvarying float vReflectionFactor;\nvoid main() {\nvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\nvec4 mPosition = objectMatrix * vec4( position, 1.0 );\nvec3 nWorld = normalize ( mat3( objectMatrix[0].xyz, objectMatrix[1].xyz, objectMatrix[2].xyz ) * normal );\nvec3 I = mPosition.xyz - cameraPosition;\nvReflect = reflect( I, nWorld );\nvRefract[0] = refract( normalize( I ), nWorld, mRefractionRatio );\nvRefract[1] = refract( normalize( I ), nWorld, mRefractionRatio * 0.99 );\nvRefract[2] = refract( normalize( I ), nWorld, mRefractionRatio * 0.98 );\nvReflectionFactor = mFresnelBias + mFresnelScale * pow( 1.0 + dot( normalize( I ), nWorld ), mFresnelPower );\ngl_Position = projectionMatrix * mvPosition;\n}"},
normal:{uniforms:THREE.UniformsUtils.merge([THREE.UniformsLib.fog,THREE.UniformsLib.lights,THREE.UniformsLib.shadowmap,{enableAO:{type:"i",value:0},enableDiffuse:{type:"i",value:0},enableSpecular:{type:"i",value:0},enableReflection:{type:"i",value:0},tDiffuse:{type:"t",value:0,texture:null},tCube:{type:"t",value:1,texture:null},tNormal:{type:"t",value:2,texture:null},tSpecular:{type:"t",value:3,texture:null},tAO:{type:"t",value:4,texture:null},tDisplacement:{type:"t",value:5,texture:null},uNormalScale:{type:"f",
value:1},uDisplacementBias:{type:"f",value:0},uDisplacementScale:{type:"f",value:1},uDiffuseColor:{type:"c",value:new THREE.Color(16777215)},uSpecularColor:{type:"c",value:new THREE.Color(1118481)},uAmbientColor:{type:"c",value:new THREE.Color(16777215)},uShininess:{type:"f",value:30},uOpacity:{type:"f",value:1},uReflectivity:{type:"f",value:0.5},uOffset:{type:"v2",value:new THREE.Vector2(0,0)},uRepeat:{type:"v2",value:new THREE.Vector2(1,1)},wrapRGB:{type:"v3",value:new THREE.Vector3(1,1,1)}}]),
fragmentShader:["uniform vec3 uAmbientColor;\nuniform vec3 uDiffuseColor;\nuniform vec3 uSpecularColor;\nuniform float uShininess;\nuniform float uOpacity;\nuniform bool enableDiffuse;\nuniform bool enableSpecular;\nuniform bool enableAO;\nuniform bool enableReflection;\nuniform sampler2D tDiffuse;\nuniform sampler2D tNormal;\nuniform sampler2D tSpecular;\nuniform sampler2D tAO;\nuniform samplerCube tCube;\nuniform float uNormalScale;\nuniform float uReflectivity;\nvarying vec3 vTangent;\nvarying vec3 vBinormal;\nvarying vec3 vNormal;\nvarying vec2 vUv;\nuniform vec3 ambientLightColor;\n#if MAX_DIR_LIGHTS > 0\nuniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];\nuniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];\n#endif\n#if MAX_POINT_LIGHTS > 0\nuniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];\nvarying vec4 vPointLight[ MAX_POINT_LIGHTS ];\n#endif\n#ifdef WRAP_AROUND\nuniform vec3 wrapRGB;\n#endif\nvarying vec3 vViewPosition;",
THREE.ShaderChunk.shadowmap_pars_fragment,THREE.ShaderChunk.fog_pars_fragment,"void main() {\ngl_FragColor = vec4( vec3( 1.0 ), uOpacity );\nvec3 specularTex = vec3( 1.0 );\nvec3 normalTex = texture2D( tNormal, vUv ).xyz * 2.0 - 1.0;\nnormalTex.xy *= uNormalScale;\nnormalTex = normalize( normalTex );\nif( enableDiffuse ) {\n#ifdef GAMMA_INPUT\nvec4 texelColor = texture2D( tDiffuse, vUv );\ntexelColor.xyz *= texelColor.xyz;\ngl_FragColor = gl_FragColor * texelColor;\n#else\ngl_FragColor = gl_FragColor * texture2D( tDiffuse, vUv );\n#endif\n}\nif( enableAO ) {\n#ifdef GAMMA_INPUT\nvec4 aoColor = texture2D( tAO, vUv );\naoColor.xyz *= aoColor.xyz;\ngl_FragColor.xyz = gl_FragColor.xyz * aoColor.xyz;\n#else\ngl_FragColor.xyz = gl_FragColor.xyz * texture2D( tAO, vUv ).xyz;\n#endif\n}\nif( enableSpecular )\nspecularTex = texture2D( tSpecular, vUv ).xyz;\nmat3 tsb = mat3( normalize( vTangent ), normalize( vBinormal ), normalize( vNormal ) );\nvec3 finalNormal = tsb * normalTex;\nvec3 normal = normalize( finalNormal );\nvec3 viewPosition = normalize( vViewPosition );\n#if MAX_POINT_LIGHTS > 0\nvec3 pointDiffuse = vec3( 0.0 );\nvec3 pointSpecular = vec3( 0.0 );\nfor ( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {\nvec3 pointVector = normalize( vPointLight[ i ].xyz );\nfloat pointDistance = vPointLight[ i ].w;\n#ifdef WRAP_AROUND\nfloat pointDiffuseWeightFull = max( dot( normal, pointVector ), 0.0 );\nfloat pointDiffuseWeightHalf = max( 0.5 * dot( normal, pointVector ) + 0.5, 0.0 );\nvec3 pointDiffuseWeight = mix( vec3 ( pointDiffuseWeightFull ), vec3( pointDiffuseWeightHalf ), wrapRGB );\n#else\nfloat pointDiffuseWeight = max( dot( normal, pointVector ), 0.0 );\n#endif\npointDiffuse += pointDistance * pointLightColor[ i ] * uDiffuseColor * pointDiffuseWeight;\nvec3 pointHalfVector = normalize( pointVector + viewPosition );\nfloat pointDotNormalHalf = max( dot( normal, pointHalfVector ), 0.0 );\nfloat pointSpecularWeight = specularTex.r * max( pow( pointDotNormalHalf, uShininess ), 0.0 );\n#ifdef PHYSICALLY_BASED_SHADING\nfloat specularNormalization = ( uShininess + 2.0001 ) / 8.0;\nvec3 schlick = uSpecularColor + vec3( 1.0 - uSpecularColor ) * pow( 1.0 - dot( pointVector, pointHalfVector ), 5.0 );\npointSpecular += schlick * pointLightColor[ i ] * pointSpecularWeight * pointDiffuseWeight * pointDistance * specularNormalization;\n#else\npointSpecular += pointDistance * pointLightColor[ i ] * uSpecularColor * pointSpecularWeight * pointDiffuseWeight;\n#endif\n}\n#endif\n#if MAX_DIR_LIGHTS > 0\nvec3 dirDiffuse = vec3( 0.0 );\nvec3 dirSpecular = vec3( 0.0 );\nfor( int i = 0; i < MAX_DIR_LIGHTS; i++ ) {\nvec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );\nvec3 dirVector = normalize( lDirection.xyz );\n#ifdef WRAP_AROUND\nfloat directionalLightWeightingFull = max( dot( normal, dirVector ), 0.0 );\nfloat directionalLightWeightingHalf = max( 0.5 * dot( normal, dirVector ) + 0.5, 0.0 );\nvec3 dirDiffuseWeight = mix( vec3( directionalLightWeightingFull ), vec3( directionalLightWeightingHalf ), wrapRGB );\n#else\nfloat dirDiffuseWeight = max( dot( normal, dirVector ), 0.0 );\n#endif\ndirDiffuse += directionalLightColor[ i ] * uDiffuseColor * dirDiffuseWeight;\nvec3 dirHalfVector = normalize( dirVector + viewPosition );\nfloat dirDotNormalHalf = max( dot( normal, dirHalfVector ), 0.0 );\nfloat dirSpecularWeight = specularTex.r * max( pow( dirDotNormalHalf, uShininess ), 0.0 );\n#ifdef PHYSICALLY_BASED_SHADING\nfloat specularNormalization = ( uShininess + 2.0001 ) / 8.0;\nvec3 schlick = uSpecularColor + vec3( 1.0 - uSpecularColor ) * pow( 1.0 - dot( dirVector, dirHalfVector ), 5.0 );\ndirSpecular += schlick * directionalLightColor[ i ] * dirSpecularWeight * dirDiffuseWeight * specularNormalization;\n#else\ndirSpecular += directionalLightColor[ i ] * uSpecularColor * dirSpecularWeight * dirDiffuseWeight;\n#endif\n}\n#endif\nvec3 totalDiffuse = vec3( 0.0 );\nvec3 totalSpecular = vec3( 0.0 );\n#if MAX_DIR_LIGHTS > 0\ntotalDiffuse += dirDiffuse;\ntotalSpecular += dirSpecular;\n#endif\n#if MAX_POINT_LIGHTS > 0\ntotalDiffuse += pointDiffuse;\ntotalSpecular += pointSpecular;\n#endif\ngl_FragColor.xyz = gl_FragColor.xyz * ( totalDiffuse + ambientLightColor * uAmbientColor) + totalSpecular;\nif ( enableReflection ) {\nvec3 wPos = cameraPosition - vViewPosition;\nvec3 vReflect = reflect( normalize( wPos ), normal );\nvec4 cubeColor = textureCube( tCube, vec3( -vReflect.x, vReflect.yz ) );\n#ifdef GAMMA_INPUT\ncubeColor.xyz *= cubeColor.xyz;\n#endif\ngl_FragColor.xyz = mix( gl_FragColor.xyz, cubeColor.xyz, specularTex.r * uReflectivity );\n}",
THREE.ShaderChunk.shadowmap_fragment,THREE.ShaderChunk.linear_to_gamma_fragment,THREE.ShaderChunk.fog_fragment,"}"].join("\n"),vertexShader:["attribute vec4 tangent;\nuniform vec2 uOffset;\nuniform vec2 uRepeat;\n#ifdef VERTEX_TEXTURES\nuniform sampler2D tDisplacement;\nuniform float uDisplacementScale;\nuniform float uDisplacementBias;\n#endif\nvarying vec3 vTangent;\nvarying vec3 vBinormal;\nvarying vec3 vNormal;\nvarying vec2 vUv;\n#if MAX_POINT_LIGHTS > 0\nuniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];\nuniform float pointLightDistance[ MAX_POINT_LIGHTS ];\nvarying vec4 vPointLight[ MAX_POINT_LIGHTS ];\n#endif\nvarying vec3 vViewPosition;",
THREE.ShaderChunk.shadowmap_pars_vertex,"void main() {\nvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\nvViewPosition = -mvPosition.xyz;\nvNormal = normalMatrix * normal;\nvTangent = normalMatrix * tangent.xyz;\nvBinormal = cross( vNormal, vTangent ) * tangent.w;\nvUv = uv * uRepeat + uOffset;\n#if MAX_POINT_LIGHTS > 0\nfor( int i = 0; i < MAX_POINT_LIGHTS; i++ ) {\nvec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );\nvec3 lVector = lPosition.xyz - mvPosition.xyz;\nfloat lDistance = 1.0;\nif ( pointLightDistance[ i ] > 0.0 )\nlDistance = 1.0 - min( ( length( lVector ) / pointLightDistance[ i ] ), 1.0 );\nlVector = normalize( lVector );\nvPointLight[ i ] = vec4( lVector, lDistance );\n}\n#endif\n#ifdef VERTEX_TEXTURES\nvec3 dv = texture2D( tDisplacement, uv ).xyz;\nfloat df = uDisplacementScale * dv.x + uDisplacementBias;\nvec4 displacedPosition = vec4( normalize( vNormal.xyz ) * df, 0.0 ) + mvPosition;\ngl_Position = projectionMatrix * displacedPosition;\n#else\ngl_Position = projectionMatrix * mvPosition;\n#endif",
THREE.ShaderChunk.shadowmap_vertex,"}"].join("\n")},cube:{uniforms:{tCube:{type:"t",value:1,texture:null},tFlip:{type:"f",value:-1}},vertexShader:"varying vec3 vViewPosition;\nvoid main() {\nvec4 mPosition = objectMatrix * vec4( position, 1.0 );\nvViewPosition = cameraPosition - mPosition.xyz;\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",fragmentShader:"uniform samplerCube tCube;\nuniform float tFlip;\nvarying vec3 vViewPosition;\nvoid main() {\nvec3 wPos = cameraPosition - vViewPosition;\ngl_FragColor = textureCube( tCube, vec3( tFlip * wPos.x, wPos.yz ) );\n}"}}});
THREE.FontUtils={faces:{},face:"helvetiker",weight:"normal",style:"normal",size:150,divisions:10,getFace:function(){return this.faces[this.face][this.weight][this.style]},loadFace:function(a){var b=a.familyName.toLowerCase();this.faces[b]=this.faces[b]||{};this.faces[b][a.cssFontWeight]=this.faces[b][a.cssFontWeight]||{};this.faces[b][a.cssFontWeight][a.cssFontStyle]=a;return this.faces[b][a.cssFontWeight][a.cssFontStyle]=a},drawText:function(a){for(var b=this.getFace(),c=this.size/b.resolution,d=
0,e=(""+a).split(""),f=e.length,g=[],a=0;a<f;a++){var h=new THREE.Path,h=this.extractGlyphPoints(e[a],b,c,d,h),d=d+h.offset;g.push(h.path)}return{paths:g,offset:d/2}},extractGlyphPoints:function(a,b,c,d,e){var f=[],g,h,j,k,l,o,m,p,r,n,q,u=b.glyphs[a]||b.glyphs["?"];if(u){if(u.o){b=u._cachedOutline||(u._cachedOutline=u.o.split(" "));k=b.length;for(a=0;a<k;){j=b[a++];switch(j){case "m":j=b[a++]*c+d;l=b[a++]*c;e.moveTo(j,l);break;case "l":j=b[a++]*c+d;l=b[a++]*c;e.lineTo(j,l);break;case "q":j=b[a++]*
c+d;l=b[a++]*c;p=b[a++]*c+d;r=b[a++]*c;e.quadraticCurveTo(p,r,j,l);if(g=f[f.length-1]){o=g.x;m=g.y;g=1;for(h=this.divisions;g<=h;g++){var t=g/h;THREE.Shape.Utils.b2(t,o,p,j);THREE.Shape.Utils.b2(t,m,r,l)}}break;case "b":j=b[a++]*c+d;l=b[a++]*c;p=b[a++]*c+d;r=b[a++]*-c;n=b[a++]*c+d;q=b[a++]*-c;e.bezierCurveTo(j,l,p,r,n,q);if(g=f[f.length-1]){o=g.x;m=g.y;g=1;for(h=this.divisions;g<=h;g++){t=g/h;THREE.Shape.Utils.b3(t,o,p,n,j);THREE.Shape.Utils.b3(t,m,r,q,l)}}}}}return{offset:u.ha*c,path:e}}}};
THREE.FontUtils.generateShapes=function(a,b){var b=b||{},c=b.curveSegments!==void 0?b.curveSegments:4,d=b.font!==void 0?b.font:"helvetiker",e=b.weight!==void 0?b.weight:"normal",f=b.style!==void 0?b.style:"normal";THREE.FontUtils.size=b.size!==void 0?b.size:100;THREE.FontUtils.divisions=c;THREE.FontUtils.face=d;THREE.FontUtils.weight=e;THREE.FontUtils.style=f;c=THREE.FontUtils.drawText(a).paths;d=[];e=0;for(f=c.length;e<f;e++)Array.prototype.push.apply(d,c[e].toShapes());return d};
(function(a){var b=function(a){for(var b=a.length,e=0,f=b-1,g=0;g<b;f=g++)e=e+(a[f].x*a[g].y-a[g].x*a[f].y);return e*0.5};a.Triangulate=function(a,d){var e=a.length;if(e<3)return null;var f=[],g=[],h=[],j,k,l;if(b(a)>0)for(k=0;k<e;k++)g[k]=k;else for(k=0;k<e;k++)g[k]=e-1-k;var o=2*e;for(k=e-1;e>2;){if(o--<=0){console.log("Warning, unable to triangulate polygon!");break}j=k;e<=j&&(j=0);k=j+1;e<=k&&(k=0);l=k+1;e<=l&&(l=0);var m;a:{m=a;var p=j,r=k,n=l,q=e,u=g,t=void 0,y=void 0,s=void 0,x=void 0,E=void 0,
D=void 0,A=void 0,v=void 0,H=void 0,y=m[u[p]].x,s=m[u[p]].y,x=m[u[r]].x,E=m[u[r]].y,D=m[u[n]].x,A=m[u[n]].y;if(1.0E-10>(x-y)*(A-s)-(E-s)*(D-y))m=false;else{for(t=0;t<q;t++)if(!(t==p||t==r||t==n)){var v=m[u[t]].x,H=m[u[t]].y,I=void 0,M=void 0,R=void 0,Z=void 0,B=void 0,G=void 0,Q=void 0,C=void 0,i=void 0,P=void 0,L=void 0,S=void 0,I=R=B=void 0,I=D-x,M=A-E,R=y-D,Z=s-A,B=x-y,G=E-s,Q=v-y,C=H-s,i=v-x,P=H-E,L=v-D,S=H-A,I=I*P-M*i,B=B*C-G*Q,R=R*S-Z*L;if(I>=0&&R>=0&&B>=0){m=false;break a}}m=true}}if(m){f.push([a[g[j]],
a[g[k]],a[g[l]]]);h.push([g[j],g[k],g[l]]);j=k;for(l=k+1;l<e;j++,l++)g[j]=g[l];e--;o=2*e}}return d?h:f};a.Triangulate.area=b;return a})(THREE.FontUtils);self._typeface_js={faces:THREE.FontUtils.faces,loadFace:THREE.FontUtils.loadFace};
THREE.BufferGeometry=function(){this.id=THREE.GeometryCount++;this.vertexColorArray=this.vertexUvArray=this.vertexNormalArray=this.vertexPositionArray=this.vertexIndexArray=this.vertexColorBuffer=this.vertexUvBuffer=this.vertexNormalBuffer=this.vertexPositionBuffer=this.vertexIndexBuffer=null;this.dynamic=false;this.boundingSphere=this.boundingBox=null;this.morphTargets=[]};THREE.BufferGeometry.prototype={constructor:THREE.BufferGeometry,computeBoundingBox:function(){},computeBoundingSphere:function(){}};
THREE.Curve=function(){};THREE.Curve.prototype.getPoint=function(){console.log("Warning, getPoint() not implemented!");return null};THREE.Curve.prototype.getPointAt=function(a){return this.getPoint(this.getUtoTmapping(a))};THREE.Curve.prototype.getPoints=function(a){a||(a=5);var b,c=[];for(b=0;b<=a;b++)c.push(this.getPoint(b/a));return c};THREE.Curve.prototype.getSpacedPoints=function(a){a||(a=5);var b,c=[];for(b=0;b<=a;b++)c.push(this.getPointAt(b/a));return c};
THREE.Curve.prototype.getLength=function(){var a=this.getLengths();return a[a.length-1]};THREE.Curve.prototype.getLengths=function(a){a||(a=this.__arcLengthDivisions?this.__arcLengthDivisions:200);if(this.cacheArcLengths&&this.cacheArcLengths.length==a+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=false;var b=[],c,d=this.getPoint(0),e,f=0;b.push(0);for(e=1;e<=a;e++){c=this.getPoint(e/a);f=f+c.distanceTo(d);b.push(f);d=c}return this.cacheArcLengths=b};
THREE.Curve.prototype.updateArcLengths=function(){this.needsUpdate=true;this.getLengths()};THREE.Curve.prototype.getUtoTmapping=function(a,b){var c=this.getLengths(),d=0,e=c.length,f;f=b?b:a*c[e-1];for(var g=0,h=e-1,j;g<=h;){d=Math.floor(g+(h-g)/2);j=c[d]-f;if(j<0)g=d+1;else if(j>0)h=d-1;else{h=d;break}}d=h;if(c[d]==f)return d/(e-1);g=c[d];return c=(d+(f-g)/(c[d+1]-g))/(e-1)};THREE.Curve.prototype.getNormalVector=function(a){a=this.getTangent(a);return new THREE.Vector2(-a.y,a.x)};
THREE.Curve.prototype.getTangent=function(a){var b=a-1.0E-4,a=a+1.0E-4;b<0&&(b=0);a>1&&(a=1);b=this.getPoint(b);return this.getPoint(a).clone().subSelf(b).normalize()};THREE.Curve.prototype.getTangentAt=function(a){return this.getTangent(this.getUtoTmapping(a))};THREE.LineCurve=function(a,b){this.v1=a;this.v2=b};THREE.LineCurve.prototype=new THREE.Curve;THREE.LineCurve.prototype.constructor=THREE.LineCurve;
THREE.LineCurve.prototype.getPoint=function(a){var b=this.v2.clone().subSelf(this.v1);b.multiplyScalar(a).addSelf(this.v1);return b};THREE.LineCurve.prototype.getPointAt=function(a){return this.getPoint(a)};THREE.LineCurve.prototype.getTangent=function(){return this.v2.clone().subSelf(this.v1).normalize()};THREE.QuadraticBezierCurve=function(a,b,c){this.v0=a;this.v1=b;this.v2=c};THREE.QuadraticBezierCurve.prototype=new THREE.Curve;THREE.QuadraticBezierCurve.prototype.constructor=THREE.QuadraticBezierCurve;
THREE.QuadraticBezierCurve.prototype.getPoint=function(a){var b;b=THREE.Shape.Utils.b2(a,this.v0.x,this.v1.x,this.v2.x);a=THREE.Shape.Utils.b2(a,this.v0.y,this.v1.y,this.v2.y);return new THREE.Vector2(b,a)};THREE.QuadraticBezierCurve.prototype.getTangent=function(a){var b;b=THREE.Curve.Utils.tangentQuadraticBezier(a,this.v0.x,this.v1.x,this.v2.x);a=THREE.Curve.Utils.tangentQuadraticBezier(a,this.v0.y,this.v1.y,this.v2.y);b=new THREE.Vector2(b,a);b.normalize();return b};
THREE.CubicBezierCurve=function(a,b,c,d){this.v0=a;this.v1=b;this.v2=c;this.v3=d};THREE.CubicBezierCurve.prototype=new THREE.Curve;THREE.CubicBezierCurve.prototype.constructor=THREE.CubicBezierCurve;THREE.CubicBezierCurve.prototype.getPoint=function(a){var b;b=THREE.Shape.Utils.b3(a,this.v0.x,this.v1.x,this.v2.x,this.v3.x);a=THREE.Shape.Utils.b3(a,this.v0.y,this.v1.y,this.v2.y,this.v3.y);return new THREE.Vector2(b,a)};
THREE.CubicBezierCurve.prototype.getTangent=function(a){var b;b=THREE.Curve.Utils.tangentCubicBezier(a,this.v0.x,this.v1.x,this.v2.x,this.v3.x);a=THREE.Curve.Utils.tangentCubicBezier(a,this.v0.y,this.v1.y,this.v2.y,this.v3.y);b=new THREE.Vector2(b,a);b.normalize();return b};THREE.SplineCurve=function(a){this.points=a==void 0?[]:a};THREE.SplineCurve.prototype=new THREE.Curve;THREE.SplineCurve.prototype.constructor=THREE.SplineCurve;
THREE.SplineCurve.prototype.getPoint=function(a){var b=new THREE.Vector2,c=[],d=this.points,e;e=(d.length-1)*a;a=Math.floor(e);e=e-a;c[0]=a==0?a:a-1;c[1]=a;c[2]=a>d.length-2?d.length-1:a+1;c[3]=a>d.length-3?d.length-1:a+2;b.x=THREE.Curve.Utils.interpolate(d[c[0]].x,d[c[1]].x,d[c[2]].x,d[c[3]].x,e);b.y=THREE.Curve.Utils.interpolate(d[c[0]].y,d[c[1]].y,d[c[2]].y,d[c[3]].y,e);return b};
THREE.ArcCurve=function(a,b,c,d,e,f){this.aX=a;this.aY=b;this.aRadius=c;this.aStartAngle=d;this.aEndAngle=e;this.aClockwise=f};THREE.ArcCurve.prototype=new THREE.Curve;THREE.ArcCurve.prototype.constructor=THREE.ArcCurve;THREE.ArcCurve.prototype.getPoint=function(a){var b=this.aEndAngle-this.aStartAngle;this.aClockwise||(a=1-a);b=this.aStartAngle+a*b;a=this.aX+this.aRadius*Math.cos(b);b=this.aY+this.aRadius*Math.sin(b);return new THREE.Vector2(a,b)};
THREE.Curve.Utils={tangentQuadraticBezier:function(a,b,c,d){return 2*(1-a)*(c-b)+2*a*(d-c)},tangentCubicBezier:function(a,b,c,d,e){return-3*b*(1-a)*(1-a)+3*c*(1-a)*(1-a)-6*a*c*(1-a)+6*a*d*(1-a)-3*a*a*d+3*a*a*e},tangentSpline:function(a){return 6*a*a-6*a+(3*a*a-4*a+1)+(-6*a*a+6*a)+(3*a*a-2*a)},interpolate:function(a,b,c,d,e){var a=(c-a)*0.5,d=(d-b)*0.5,f=e*e;return(2*b-2*c+a+d)*e*f+(-3*b+3*c-2*a-d)*f+a*e+b}};
THREE.Curve.create=function(a,b){a.prototype=new THREE.Curve;a.prototype.constructor=a;a.prototype.getPoint=b;return a};THREE.LineCurve3=THREE.Curve.create(function(a,b){this.v1=a;this.v2=b},function(a){var b=new THREE.Vector3;b.sub(this.v2,this.v1);b.multiplyScalar(a);b.addSelf(this.v1);return b});
THREE.QuadraticBezierCurve3=THREE.Curve.create(function(a,b,c){this.v0=a;this.v1=b;this.v2=c},function(a){var b,c;b=THREE.Shape.Utils.b2(a,this.v0.x,this.v1.x,this.v2.x);c=THREE.Shape.Utils.b2(a,this.v0.y,this.v1.y,this.v2.y);a=THREE.Shape.Utils.b2(a,this.v0.z,this.v1.z,this.v2.z);return new THREE.Vector3(b,c,a)});
THREE.CubicBezierCurve3=THREE.Curve.create(function(a,b,c,d){this.v0=a;this.v1=b;this.v2=c;this.v3=d},function(a){var b,c;b=THREE.Shape.Utils.b3(a,this.v0.x,this.v1.x,this.v2.x,this.v3.x);c=THREE.Shape.Utils.b3(a,this.v0.y,this.v1.y,this.v2.y,this.v3.y);a=THREE.Shape.Utils.b3(a,this.v0.z,this.v1.z,this.v2.z,this.v3.z);return new THREE.Vector3(b,c,a)});
THREE.SplineCurve3=THREE.Curve.create(function(a){this.points=a==void 0?[]:a},function(a){var b=new THREE.Vector3,c=[],d=this.points,e,a=(d.length-1)*a;e=Math.floor(a);a=a-e;c[0]=e==0?e:e-1;c[1]=e;c[2]=e>d.length-2?d.length-1:e+1;c[3]=e>d.length-3?d.length-1:e+2;e=d[c[0]];var f=d[c[1]],g=d[c[2]],c=d[c[3]];b.x=THREE.Curve.Utils.interpolate(e.x,f.x,g.x,c.x,a);b.y=THREE.Curve.Utils.interpolate(e.y,f.y,g.y,c.y,a);b.z=THREE.Curve.Utils.interpolate(e.z,f.z,g.z,c.z,a);return b});
THREE.ClosedSplineCurve3=THREE.Curve.create(function(a){this.points=a==void 0?[]:a},function(a){var b=new THREE.Vector3,c=[],d=this.points,e;e=(d.length-0)*a;a=Math.floor(e);e=e-a;a=a+(a>0?0:(Math.floor(Math.abs(a)/d.length)+1)*d.length);c[0]=(a-1)%d.length;c[1]=a%d.length;c[2]=(a+1)%d.length;c[3]=(a+2)%d.length;b.x=THREE.Curve.Utils.interpolate(d[c[0]].x,d[c[1]].x,d[c[2]].x,d[c[3]].x,e);b.y=THREE.Curve.Utils.interpolate(d[c[0]].y,d[c[1]].y,d[c[2]].y,d[c[3]].y,e);b.z=THREE.Curve.Utils.interpolate(d[c[0]].z,
d[c[1]].z,d[c[2]].z,d[c[3]].z,e);return b});THREE.CurvePath=function(){this.curves=[];this.bends=[];this.autoClose=false};THREE.CurvePath.prototype=new THREE.Curve;THREE.CurvePath.prototype.constructor=THREE.CurvePath;THREE.CurvePath.prototype.add=function(a){this.curves.push(a)};THREE.CurvePath.prototype.checkConnection=function(){};
THREE.CurvePath.prototype.closePath=function(){var a=this.curves[0].getPoint(0),b=this.curves[this.curves.length-1].getPoint(1);a.equals(b)||this.curves.push(new THREE.LineCurve(b,a))};THREE.CurvePath.prototype.getPoint=function(a){for(var b=a*this.getLength(),c=this.getCurveLengths(),a=0;a<c.length;){if(c[a]>=b){b=c[a]-b;a=this.curves[a];b=1-b/a.getLength();return a.getPointAt(b)}a++}return null};THREE.CurvePath.prototype.getLength=function(){var a=this.getCurveLengths();return a[a.length-1]};
THREE.CurvePath.prototype.getCurveLengths=function(){if(this.cacheLengths&&this.cacheLengths.length==this.curves.length)return this.cacheLengths;var a=[],b=0,c,d=this.curves.length;for(c=0;c<d;c++){b=b+this.curves[c].getLength();a.push(b)}return this.cacheLengths=a};
THREE.CurvePath.prototype.getBoundingBox=function(){var a=this.getPoints(),b,c,d,e;b=c=Number.NEGATIVE_INFINITY;d=e=Number.POSITIVE_INFINITY;var f,g,h,j;j=new THREE.Vector2;g=0;for(h=a.length;g<h;g++){f=a[g];if(f.x>b)b=f.x;else if(f.x<d)d=f.x;if(f.y>c)c=f.y;else if(f.y<e)e=f.y;j.addSelf(f.x,f.y)}return{minX:d,minY:e,maxX:b,maxY:c,centroid:j.divideScalar(h)}};THREE.CurvePath.prototype.createPointsGeometry=function(a){return this.createGeometry(this.getPoints(a,true))};
THREE.CurvePath.prototype.createSpacedPointsGeometry=function(a){return this.createGeometry(this.getSpacedPoints(a,true))};THREE.CurvePath.prototype.createGeometry=function(a){for(var b=new THREE.Geometry,c=0;c<a.length;c++)b.vertices.push(new THREE.Vector3(a[c].x,a[c].y,0));return b};THREE.CurvePath.prototype.addWrapPath=function(a){this.bends.push(a)};
THREE.CurvePath.prototype.getTransformedPoints=function(a,b){var c=this.getPoints(a),d,e;if(!b)b=this.bends;d=0;for(e=b.length;d<e;d++)c=this.getWrapPoints(c,b[d]);return c};THREE.CurvePath.prototype.getTransformedSpacedPoints=function(a,b){var c=this.getSpacedPoints(a),d,e;if(!b)b=this.bends;d=0;for(e=b.length;d<e;d++)c=this.getWrapPoints(c,b[d]);return c};
THREE.CurvePath.prototype.getWrapPoints=function(a,b){var c=this.getBoundingBox(),d,e,f,g,h,j;d=0;for(e=a.length;d<e;d++){f=a[d];g=f.x;h=f.y;j=g/c.maxX;j=b.getUtoTmapping(j,g);g=b.getPoint(j);h=b.getNormalVector(j).multiplyScalar(h);f.x=g.x+h.x;f.y=g.y+h.y}return a};THREE.Gyroscope=function(){THREE.Object3D.call(this)};THREE.Gyroscope.prototype=new THREE.Object3D;THREE.Gyroscope.prototype.constructor=THREE.Gyroscope;
THREE.Gyroscope.prototype.updateMatrixWorld=function(a){this.matrixAutoUpdate&&this.updateMatrix();if(this.matrixWorldNeedsUpdate||a){if(this.parent){this.matrixWorld.multiply(this.parent.matrixWorld,this.matrix);this.matrixWorld.decompose(this.translationWorld,this.rotationWorld,this.scaleWorld);this.matrix.decompose(this.translationObject,this.rotationObject,this.scaleObject);this.matrixWorld.compose(this.translationWorld,this.rotationObject,this.scaleWorld)}else this.matrixWorld.copy(this.matrix);
this.matrixWorldNeedsUpdate=false;a=true}for(var b=0,c=this.children.length;b<c;b++)this.children[b].updateMatrixWorld(a)};THREE.Gyroscope.prototype.translationWorld=new THREE.Vector3;THREE.Gyroscope.prototype.translationObject=new THREE.Vector3;THREE.Gyroscope.prototype.rotationWorld=new THREE.Quaternion;THREE.Gyroscope.prototype.rotationObject=new THREE.Quaternion;THREE.Gyroscope.prototype.scaleWorld=new THREE.Vector3;THREE.Gyroscope.prototype.scaleObject=new THREE.Vector3;
THREE.Path=function(a){THREE.CurvePath.call(this);this.actions=[];a&&this.fromPoints(a)};THREE.Path.prototype=new THREE.CurvePath;THREE.Path.prototype.constructor=THREE.Path;THREE.PathActions={MOVE_TO:"moveTo",LINE_TO:"lineTo",QUADRATIC_CURVE_TO:"quadraticCurveTo",BEZIER_CURVE_TO:"bezierCurveTo",CSPLINE_THRU:"splineThru",ARC:"arc"};THREE.Path.prototype.fromPoints=function(a){this.moveTo(a[0].x,a[0].y);for(var b=1,c=a.length;b<c;b++)this.lineTo(a[b].x,a[b].y)};
THREE.Path.prototype.moveTo=function(a,b){var c=Array.prototype.slice.call(arguments);this.actions.push({action:THREE.PathActions.MOVE_TO,args:c})};THREE.Path.prototype.lineTo=function(a,b){var c=Array.prototype.slice.call(arguments),d=this.actions[this.actions.length-1].args;this.curves.push(new THREE.LineCurve(new THREE.Vector2(d[d.length-2],d[d.length-1]),new THREE.Vector2(a,b)));this.actions.push({action:THREE.PathActions.LINE_TO,args:c})};
THREE.Path.prototype.quadraticCurveTo=function(a,b,c,d){var e=Array.prototype.slice.call(arguments),f=this.actions[this.actions.length-1].args;this.curves.push(new THREE.QuadraticBezierCurve(new THREE.Vector2(f[f.length-2],f[f.length-1]),new THREE.Vector2(a,b),new THREE.Vector2(c,d)));this.actions.push({action:THREE.PathActions.QUADRATIC_CURVE_TO,args:e})};
THREE.Path.prototype.bezierCurveTo=function(a,b,c,d,e,f){var g=Array.prototype.slice.call(arguments),h=this.actions[this.actions.length-1].args;this.curves.push(new THREE.CubicBezierCurve(new THREE.Vector2(h[h.length-2],h[h.length-1]),new THREE.Vector2(a,b),new THREE.Vector2(c,d),new THREE.Vector2(e,f)));this.actions.push({action:THREE.PathActions.BEZIER_CURVE_TO,args:g})};
THREE.Path.prototype.splineThru=function(a){var b=Array.prototype.slice.call(arguments),c=this.actions[this.actions.length-1].args,c=[new THREE.Vector2(c[c.length-2],c[c.length-1])];Array.prototype.push.apply(c,a);this.curves.push(new THREE.SplineCurve(c));this.actions.push({action:THREE.PathActions.CSPLINE_THRU,args:b})};
THREE.Path.prototype.arc=function(a,b,c,d,e,f){var g=Array.prototype.slice.call(arguments),h=this.actions[this.actions.length-1],h=new THREE.ArcCurve(h.x+a,h.y+b,c,d,e,f);this.curves.push(h);h=h.getPoint(f?1:0);g.push(h.x);g.push(h.y);this.actions.push({action:THREE.PathActions.ARC,args:g})};
THREE.Path.prototype.absarc=function(a,b,c,d,e,f){var g=Array.prototype.slice.call(arguments),h=new THREE.ArcCurve(a,b,c,d,e,f);this.curves.push(h);h=h.getPoint(f?1:0);g.push(h.x);g.push(h.y);this.actions.push({action:THREE.PathActions.ARC,args:g})};THREE.Path.prototype.getSpacedPoints=function(a){a||(a=40);for(var b=[],c=0;c<a;c++)b.push(this.getPoint(c/a));return b};
THREE.Path.prototype.getPoints=function(a,b){if(this.useSpacedPoints){console.log("tata");return this.getSpacedPoints(a,b)}var a=a||12,c=[],d,e,f,g,h,j,k,l,o,m,p,r,n;d=0;for(e=this.actions.length;d<e;d++){f=this.actions[d];g=f.action;f=f.args;switch(g){case THREE.PathActions.MOVE_TO:c.push(new THREE.Vector2(f[0],f[1]));break;case THREE.PathActions.LINE_TO:c.push(new THREE.Vector2(f[0],f[1]));break;case THREE.PathActions.QUADRATIC_CURVE_TO:h=f[2];j=f[3];o=f[0];m=f[1];if(c.length>0){g=c[c.length-1];
p=g.x;r=g.y}else{g=this.actions[d-1].args;p=g[g.length-2];r=g[g.length-1]}for(f=1;f<=a;f++){n=f/a;g=THREE.Shape.Utils.b2(n,p,o,h);n=THREE.Shape.Utils.b2(n,r,m,j);c.push(new THREE.Vector2(g,n))}break;case THREE.PathActions.BEZIER_CURVE_TO:h=f[4];j=f[5];o=f[0];m=f[1];k=f[2];l=f[3];if(c.length>0){g=c[c.length-1];p=g.x;r=g.y}else{g=this.actions[d-1].args;p=g[g.length-2];r=g[g.length-1]}for(f=1;f<=a;f++){n=f/a;g=THREE.Shape.Utils.b3(n,p,o,k,h);n=THREE.Shape.Utils.b3(n,r,m,l,j);c.push(new THREE.Vector2(g,
n))}break;case THREE.PathActions.CSPLINE_THRU:g=this.actions[d-1].args;n=[new THREE.Vector2(g[g.length-2],g[g.length-1])];g=a*f[0].length;n=n.concat(f[0]);n=new THREE.SplineCurve(n);for(f=1;f<=g;f++)c.push(n.getPointAt(f/g));break;case THREE.PathActions.ARC:h=f[0];j=f[1];k=f[2];o=f[3];m=!!f[5];l=f[4]-o;p=a*2;for(f=1;f<=p;f++){n=f/p;m||(n=1-n);n=o+n*l;g=h+k*Math.cos(n);n=j+k*Math.sin(n);c.push(new THREE.Vector2(g,n))}}}d=c[c.length-1];Math.abs(d.x-c[0].x)<1.0E-10&&Math.abs(d.y-c[0].y)<1.0E-10&&c.splice(c.length-
1,1);b&&c.push(c[0]);return c};
THREE.Path.prototype.toShapes=function(){var a,b,c,d,e=[],f=new THREE.Path;a=0;for(b=this.actions.length;a<b;a++){c=this.actions[a];d=c.args;c=c.action;if(c==THREE.PathActions.MOVE_TO&&f.actions.length!=0){e.push(f);f=new THREE.Path}f[c].apply(f,d)}f.actions.length!=0&&e.push(f);if(e.length==0)return[];var g;d=[];a=!THREE.Shape.Utils.isClockWise(e[0].getPoints());if(e.length==1){f=e[0];g=new THREE.Shape;g.actions=f.actions;g.curves=f.curves;d.push(g);return d}if(a){g=new THREE.Shape;a=0;for(b=e.length;a<
b;a++){f=e[a];if(THREE.Shape.Utils.isClockWise(f.getPoints())){g.actions=f.actions;g.curves=f.curves;d.push(g);g=new THREE.Shape}else g.holes.push(f)}}else{a=0;for(b=e.length;a<b;a++){f=e[a];if(THREE.Shape.Utils.isClockWise(f.getPoints())){g&&d.push(g);g=new THREE.Shape;g.actions=f.actions;g.curves=f.curves}else g.holes.push(f)}d.push(g)}return d};THREE.Shape=function(){THREE.Path.apply(this,arguments);this.holes=[]};THREE.Shape.prototype=new THREE.Path;THREE.Shape.prototype.constructor=THREE.Path;
THREE.Shape.prototype.extrude=function(a){return new THREE.ExtrudeGeometry(this,a)};THREE.Shape.prototype.getPointsHoles=function(a){var b,c=this.holes.length,d=[];for(b=0;b<c;b++)d[b]=this.holes[b].getTransformedPoints(a,this.bends);return d};THREE.Shape.prototype.getSpacedPointsHoles=function(a){var b,c=this.holes.length,d=[];for(b=0;b<c;b++)d[b]=this.holes[b].getTransformedSpacedPoints(a,this.bends);return d};
THREE.Shape.prototype.extractAllPoints=function(a){return{shape:this.getTransformedPoints(a),holes:this.getPointsHoles(a)}};THREE.Shape.prototype.extractPoints=function(a){return this.useSpacedPoints?this.extractAllSpacedPoints(a):this.extractAllPoints(a)};THREE.Shape.prototype.extractAllSpacedPoints=function(a){return{shape:this.getTransformedSpacedPoints(a),holes:this.getSpacedPointsHoles(a)}};
THREE.Shape.Utils={removeHoles:function(a,b){var c=a.concat(),d=c.concat(),e,f,g,h,j,k,l,o,m,p,r=[];for(j=0;j<b.length;j++){k=b[j];Array.prototype.push.apply(d,k);f=Number.POSITIVE_INFINITY;for(e=0;e<k.length;e++){m=k[e];p=[];for(o=0;o<c.length;o++){l=c[o];l=m.distanceToSquared(l);p.push(l);if(l<f){f=l;g=e;h=o}}}e=h-1>=0?h-1:c.length-1;f=g-1>=0?g-1:k.length-1;var n=[k[g],c[h],c[e]];o=THREE.FontUtils.Triangulate.area(n);var q=[k[g],k[f],c[h]];m=THREE.FontUtils.Triangulate.area(q);p=h;l=g;h=h+1;g=g+
-1;h<0&&(h=h+c.length);h=h%c.length;g<0&&(g=g+k.length);g=g%k.length;e=h-1>=0?h-1:c.length-1;f=g-1>=0?g-1:k.length-1;n=[k[g],c[h],c[e]];n=THREE.FontUtils.Triangulate.area(n);q=[k[g],k[f],c[h]];q=THREE.FontUtils.Triangulate.area(q);if(o+m>n+q){h=p;g=l;h<0&&(h=h+c.length);h=h%c.length;g<0&&(g=g+k.length);g=g%k.length;e=h-1>=0?h-1:c.length-1;f=g-1>=0?g-1:k.length-1}o=c.slice(0,h);m=c.slice(h);p=k.slice(g);l=k.slice(0,g);f=[k[g],k[f],c[h]];r.push([k[g],c[h],c[e]]);r.push(f);c=o.concat(p).concat(l).concat(m)}return{shape:c,
isolatedPts:r,allpoints:d}},triangulateShape:function(a,b){var c=THREE.Shape.Utils.removeHoles(a,b),d=c.allpoints,e=c.isolatedPts,c=THREE.FontUtils.Triangulate(c.shape,false),f,g,h,j,k={};f=0;for(g=d.length;f<g;f++){j=d[f].x+":"+d[f].y;k[j]!==void 0&&console.log("Duplicate point",j);k[j]=f}f=0;for(g=c.length;f<g;f++){h=c[f];for(d=0;d<3;d++){j=h[d].x+":"+h[d].y;j=k[j];j!==void 0&&(h[d]=j)}}f=0;for(g=e.length;f<g;f++){h=e[f];for(d=0;d<3;d++){j=h[d].x+":"+h[d].y;j=k[j];j!==void 0&&(h[d]=j)}}return c.concat(e)},
isClockWise:function(a){return THREE.FontUtils.Triangulate.area(a)<0},b2p0:function(a,b){var c=1-a;return c*c*b},b2p1:function(a,b){return 2*(1-a)*a*b},b2p2:function(a,b){return a*a*b},b2:function(a,b,c,d){return this.b2p0(a,b)+this.b2p1(a,c)+this.b2p2(a,d)},b3p0:function(a,b){var c=1-a;return c*c*c*b},b3p1:function(a,b){var c=1-a;return 3*c*c*a*b},b3p2:function(a,b){return 3*(1-a)*a*a*b},b3p3:function(a,b){return a*a*a*b},b3:function(a,b,c,d,e){return this.b3p0(a,b)+this.b3p1(a,c)+this.b3p2(a,d)+
this.b3p3(a,e)}};
THREE.AnimationHandler=function(){var a=[],b={},c={update:function(b){for(var c=0;c<a.length;c++)a[c].update(b)},addToUpdate:function(b){a.indexOf(b)===-1&&a.push(b)},removeFromUpdate:function(b){b=a.indexOf(b);b!==-1&&a.splice(b,1)},add:function(a){b[a.name]!==void 0&&console.log("THREE.AnimationHandler.add: Warning! "+a.name+" already exists in library. Overwriting.");b[a.name]=a;if(a.initialized!==true){for(var c=0;c<a.hierarchy.length;c++){for(var d=0;d<a.hierarchy[c].keys.length;d++){if(a.hierarchy[c].keys[d].time<0)a.hierarchy[c].keys[d].time=
0;if(a.hierarchy[c].keys[d].rot!==void 0&&!(a.hierarchy[c].keys[d].rot instanceof THREE.Quaternion)){var h=a.hierarchy[c].keys[d].rot;a.hierarchy[c].keys[d].rot=new THREE.Quaternion(h[0],h[1],h[2],h[3])}}if(a.hierarchy[c].keys.length&&a.hierarchy[c].keys[0].morphTargets!==void 0){h={};for(d=0;d<a.hierarchy[c].keys.length;d++)for(var j=0;j<a.hierarchy[c].keys[d].morphTargets.length;j++){var k=a.hierarchy[c].keys[d].morphTargets[j];h[k]=-1}a.hierarchy[c].usedMorphTargets=h;for(d=0;d<a.hierarchy[c].keys.length;d++){var l=
{};for(k in h){for(j=0;j<a.hierarchy[c].keys[d].morphTargets.length;j++)if(a.hierarchy[c].keys[d].morphTargets[j]===k){l[k]=a.hierarchy[c].keys[d].morphTargetsInfluences[j];break}j===a.hierarchy[c].keys[d].morphTargets.length&&(l[k]=0)}a.hierarchy[c].keys[d].morphTargetsInfluences=l}}for(d=1;d<a.hierarchy[c].keys.length;d++)if(a.hierarchy[c].keys[d].time===a.hierarchy[c].keys[d-1].time){a.hierarchy[c].keys.splice(d,1);d--}for(d=0;d<a.hierarchy[c].keys.length;d++)a.hierarchy[c].keys[d].index=d}d=parseInt(a.length*
a.fps,10);a.JIT={};a.JIT.hierarchy=[];for(c=0;c<a.hierarchy.length;c++)a.JIT.hierarchy.push(Array(d));a.initialized=true}},get:function(a){if(typeof a==="string"){if(b[a])return b[a];console.log("THREE.AnimationHandler.get: Couldn't find animation "+a);return null}},parse:function(a){var b=[];if(a instanceof THREE.SkinnedMesh)for(var c=0;c<a.bones.length;c++)b.push(a.bones[c]);else d(a,b);return b}},d=function(a,b){b.push(a);for(var c=0;c<a.children.length;c++)d(a.children[c],b)};c.LINEAR=0;c.CATMULLROM=
1;c.CATMULLROM_FORWARD=2;return c}();THREE.Animation=function(a,b,c,d){this.root=a;this.data=THREE.AnimationHandler.get(b);this.hierarchy=THREE.AnimationHandler.parse(a);this.currentTime=0;this.timeScale=1;this.isPlaying=false;this.loop=this.isPaused=true;this.interpolationType=c!==void 0?c:THREE.AnimationHandler.LINEAR;this.JITCompile=d!==void 0?d:true;this.points=[];this.target=new THREE.Vector3};
THREE.Animation.prototype.play=function(a,b){if(!this.isPlaying){this.isPlaying=true;this.loop=a!==void 0?a:true;this.currentTime=b!==void 0?b:0;var c,d=this.hierarchy.length,e;for(c=0;c<d;c++){e=this.hierarchy[c];if(this.interpolationType!==THREE.AnimationHandler.CATMULLROM_FORWARD)e.useQuaternion=true;e.matrixAutoUpdate=true;if(e.animationCache===void 0){e.animationCache={};e.animationCache.prevKey={pos:0,rot:0,scl:0};e.animationCache.nextKey={pos:0,rot:0,scl:0};e.animationCache.originalMatrix=
e instanceof THREE.Bone?e.skinMatrix:e.matrix}var f=e.animationCache.prevKey;e=e.animationCache.nextKey;f.pos=this.data.hierarchy[c].keys[0];f.rot=this.data.hierarchy[c].keys[0];f.scl=this.data.hierarchy[c].keys[0];e.pos=this.getNextKeyWith("pos",c,1);e.rot=this.getNextKeyWith("rot",c,1);e.scl=this.getNextKeyWith("scl",c,1)}this.update(0)}this.isPaused=false;THREE.AnimationHandler.addToUpdate(this)};
THREE.Animation.prototype.pause=function(){this.isPaused?THREE.AnimationHandler.addToUpdate(this):THREE.AnimationHandler.removeFromUpdate(this);this.isPaused=!this.isPaused};
THREE.Animation.prototype.stop=function(){this.isPaused=this.isPlaying=false;THREE.AnimationHandler.removeFromUpdate(this);for(var a=0;a<this.hierarchy.length;a++)if(this.hierarchy[a].animationCache!==void 0){this.hierarchy[a]instanceof THREE.Bone?this.hierarchy[a].skinMatrix=this.hierarchy[a].animationCache.originalMatrix:this.hierarchy[a].matrix=this.hierarchy[a].animationCache.originalMatrix;delete this.hierarchy[a].animationCache}};
THREE.Animation.prototype.update=function(a){if(this.isPlaying){var b=["pos","rot","scl"],c,d,e,f,g,h,j,k,l=this.data.JIT.hierarchy,o,m;m=this.currentTime=this.currentTime+a*this.timeScale;o=this.currentTime=this.currentTime%this.data.length;k=parseInt(Math.min(o*this.data.fps,this.data.length*this.data.fps),10);for(var p=0,r=this.hierarchy.length;p<r;p++){a=this.hierarchy[p];j=a.animationCache;if(this.JITCompile&&l[p][k]!==void 0)if(a instanceof THREE.Bone){a.skinMatrix=l[p][k];a.matrixAutoUpdate=
false;a.matrixWorldNeedsUpdate=false}else{a.matrix=l[p][k];a.matrixAutoUpdate=false;a.matrixWorldNeedsUpdate=true}else{if(this.JITCompile)a instanceof THREE.Bone?a.skinMatrix=a.animationCache.originalMatrix:a.matrix=a.animationCache.originalMatrix;for(var n=0;n<3;n++){c=b[n];g=j.prevKey[c];h=j.nextKey[c];if(h.time<=m){if(o<m)if(this.loop){g=this.data.hierarchy[p].keys[0];for(h=this.getNextKeyWith(c,p,1);h.time<o;){g=h;h=this.getNextKeyWith(c,p,h.index+1)}}else{this.stop();return}else{do{g=h;h=this.getNextKeyWith(c,
p,h.index+1)}while(h.time<o)}j.prevKey[c]=g;j.nextKey[c]=h}a.matrixAutoUpdate=true;a.matrixWorldNeedsUpdate=true;d=(o-g.time)/(h.time-g.time);e=g[c];f=h[c];if(d<0||d>1){console.log("THREE.Animation.update: Warning! Scale out of bounds:"+d+" on bone "+p);d=d<0?0:1}if(c==="pos"){c=a.position;if(this.interpolationType===THREE.AnimationHandler.LINEAR){c.x=e[0]+(f[0]-e[0])*d;c.y=e[1]+(f[1]-e[1])*d;c.z=e[2]+(f[2]-e[2])*d}else if(this.interpolationType===THREE.AnimationHandler.CATMULLROM||this.interpolationType===
THREE.AnimationHandler.CATMULLROM_FORWARD){this.points[0]=this.getPrevKeyWith("pos",p,g.index-1).pos;this.points[1]=e;this.points[2]=f;this.points[3]=this.getNextKeyWith("pos",p,h.index+1).pos;d=d*0.33+0.33;e=this.interpolateCatmullRom(this.points,d);c.x=e[0];c.y=e[1];c.z=e[2];if(this.interpolationType===THREE.AnimationHandler.CATMULLROM_FORWARD){d=this.interpolateCatmullRom(this.points,d*1.01);this.target.set(d[0],d[1],d[2]);this.target.subSelf(c);this.target.y=0;this.target.normalize();d=Math.atan2(this.target.x,
this.target.z);a.rotation.set(0,d,0)}}}else if(c==="rot")THREE.Quaternion.slerp(e,f,a.quaternion,d);else if(c==="scl"){c=a.scale;c.x=e[0]+(f[0]-e[0])*d;c.y=e[1]+(f[1]-e[1])*d;c.z=e[2]+(f[2]-e[2])*d}}}}if(this.JITCompile&&l[0][k]===void 0){this.hierarchy[0].updateMatrixWorld(true);for(p=0;p<this.hierarchy.length;p++)l[p][k]=this.hierarchy[p]instanceof THREE.Bone?this.hierarchy[p].skinMatrix.clone():this.hierarchy[p].matrix.clone()}}};
THREE.Animation.prototype.interpolateCatmullRom=function(a,b){var c=[],d=[],e,f,g,h,j,k;e=(a.length-1)*b;f=Math.floor(e);e=e-f;c[0]=f===0?f:f-1;c[1]=f;c[2]=f>a.length-2?f:f+1;c[3]=f>a.length-3?f:f+2;f=a[c[0]];h=a[c[1]];j=a[c[2]];k=a[c[3]];c=e*e;g=e*c;d[0]=this.interpolate(f[0],h[0],j[0],k[0],e,c,g);d[1]=this.interpolate(f[1],h[1],j[1],k[1],e,c,g);d[2]=this.interpolate(f[2],h[2],j[2],k[2],e,c,g);return d};
THREE.Animation.prototype.interpolate=function(a,b,c,d,e,f,g){a=(c-a)*0.5;d=(d-b)*0.5;return(2*(b-c)+a+d)*g+(-3*(b-c)-2*a-d)*f+a*e+b};THREE.Animation.prototype.getNextKeyWith=function(a,b,c){for(var d=this.data.hierarchy[b].keys,c=this.interpolationType===THREE.AnimationHandler.CATMULLROM||this.interpolationType===THREE.AnimationHandler.CATMULLROM_FORWARD?c<d.length-1?c:d.length-1:c%d.length;c<d.length;c++)if(d[c][a]!==void 0)return d[c];return this.data.hierarchy[b].keys[0]};
THREE.Animation.prototype.getPrevKeyWith=function(a,b,c){for(var d=this.data.hierarchy[b].keys,c=this.interpolationType===THREE.AnimationHandler.CATMULLROM||this.interpolationType===THREE.AnimationHandler.CATMULLROM_FORWARD?c>0?c:0:c>=0?c:c+d.length;c>=0;c--)if(d[c][a]!==void 0)return d[c];return this.data.hierarchy[b].keys[d.length-1]};
THREE.KeyFrameAnimation=function(a,b,c){this.root=a;this.data=THREE.AnimationHandler.get(b);this.hierarchy=THREE.AnimationHandler.parse(a);this.currentTime=0;this.timeScale=0.001;this.isPlaying=false;this.loop=this.isPaused=true;this.JITCompile=c!==void 0?c:true;a=0;for(b=this.hierarchy.length;a<b;a++){var c=this.data.hierarchy[a].sids,d=this.hierarchy[a];if(this.data.hierarchy[a].keys.length&&c){for(var e=0;e<c.length;e++){var f=c[e],g=this.getNextKeyWith(f,a,0);g&&g.apply(f)}d.matrixAutoUpdate=
false;this.data.hierarchy[a].node.updateMatrix();d.matrixWorldNeedsUpdate=true}}};
THREE.KeyFrameAnimation.prototype.play=function(a,b){if(!this.isPlaying){this.isPlaying=true;this.loop=a!==void 0?a:true;this.currentTime=b!==void 0?b:0;this.startTimeMs=b;this.startTime=1E7;this.endTime=-this.startTime;var c,d=this.hierarchy.length,e,f;for(c=0;c<d;c++){e=this.hierarchy[c];f=this.data.hierarchy[c];e.useQuaternion=true;if(f.animationCache===void 0){f.animationCache={};f.animationCache.prevKey=null;f.animationCache.nextKey=null;f.animationCache.originalMatrix=e instanceof THREE.Bone?
e.skinMatrix:e.matrix}e=this.data.hierarchy[c].keys;if(e.length){f.animationCache.prevKey=e[0];f.animationCache.nextKey=e[1];this.startTime=Math.min(e[0].time,this.startTime);this.endTime=Math.max(e[e.length-1].time,this.endTime)}}this.update(0)}this.isPaused=false;THREE.AnimationHandler.addToUpdate(this)};THREE.KeyFrameAnimation.prototype.pause=function(){this.isPaused?THREE.AnimationHandler.addToUpdate(this):THREE.AnimationHandler.removeFromUpdate(this);this.isPaused=!this.isPaused};
THREE.KeyFrameAnimation.prototype.stop=function(){this.isPaused=this.isPlaying=false;THREE.AnimationHandler.removeFromUpdate(this);for(var a=0;a<this.data.hierarchy.length;a++){var b=this.hierarchy[a],c=this.data.hierarchy[a];if(c.animationCache!==void 0){var d=c.animationCache.originalMatrix;if(b instanceof THREE.Bone){d.copy(b.skinMatrix);b.skinMatrix=d}else{d.copy(b.matrix);b.matrix=d}delete c.animationCache}}};
THREE.KeyFrameAnimation.prototype.update=function(a){if(this.isPlaying){var b,c,d,e,f=this.data.JIT.hierarchy,g,h,j;h=this.currentTime=this.currentTime+a*this.timeScale;g=this.currentTime=this.currentTime%this.data.length;if(g<this.startTimeMs)g=this.currentTime=this.startTimeMs+g;e=parseInt(Math.min(g*this.data.fps,this.data.length*this.data.fps),10);if((j=g<h)&&!this.loop){for(var a=0,k=this.hierarchy.length;a<k;a++){var l=this.data.hierarchy[a].keys,f=this.data.hierarchy[a].sids;d=l.length-1;e=
this.hierarchy[a];if(l.length){for(l=0;l<f.length;l++){g=f[l];(h=this.getPrevKeyWith(g,a,d))&&h.apply(g)}this.data.hierarchy[a].node.updateMatrix();e.matrixWorldNeedsUpdate=true}}this.stop()}else if(!(g<this.startTime)){a=0;for(k=this.hierarchy.length;a<k;a++){d=this.hierarchy[a];b=this.data.hierarchy[a];var l=b.keys,o=b.animationCache;if(this.JITCompile&&f[a][e]!==void 0)if(d instanceof THREE.Bone){d.skinMatrix=f[a][e];d.matrixWorldNeedsUpdate=false}else{d.matrix=f[a][e];d.matrixWorldNeedsUpdate=
true}else if(l.length){if(this.JITCompile&&o)d instanceof THREE.Bone?d.skinMatrix=o.originalMatrix:d.matrix=o.originalMatrix;b=o.prevKey;c=o.nextKey;if(b&&c){if(c.time<=h){if(j&&this.loop){b=l[0];for(c=l[1];c.time<g;){b=c;c=l[b.index+1]}}else if(!j)for(var m=l.length-1;c.time<g&&c.index!==m;){b=c;c=l[b.index+1]}o.prevKey=b;o.nextKey=c}c.time>=g?b.interpolate(c,g):b.interpolate(c,c.time)}this.data.hierarchy[a].node.updateMatrix();d.matrixWorldNeedsUpdate=true}}if(this.JITCompile&&f[0][e]===void 0){this.hierarchy[0].updateMatrixWorld(true);
for(a=0;a<this.hierarchy.length;a++)f[a][e]=this.hierarchy[a]instanceof THREE.Bone?this.hierarchy[a].skinMatrix.clone():this.hierarchy[a].matrix.clone()}}}};THREE.KeyFrameAnimation.prototype.getNextKeyWith=function(a,b,c){b=this.data.hierarchy[b].keys;for(c=c%b.length;c<b.length;c++)if(b[c].hasTarget(a))return b[c];return b[0]};
THREE.KeyFrameAnimation.prototype.getPrevKeyWith=function(a,b,c){b=this.data.hierarchy[b].keys;for(c=c>=0?c:c+b.length;c>=0;c--)if(b[c].hasTarget(a))return b[c];return b[b.length-1]};
THREE.CubeCamera=function(a,b,c){THREE.Object3D.call(this);var d=new THREE.PerspectiveCamera(90,1,a,b);d.up.set(0,-1,0);d.lookAt(new THREE.Vector3(1,0,0));this.add(d);var e=new THREE.PerspectiveCamera(90,1,a,b);e.up.set(0,-1,0);e.lookAt(new THREE.Vector3(-1,0,0));this.add(e);var f=new THREE.PerspectiveCamera(90,1,a,b);f.up.set(0,0,1);f.lookAt(new THREE.Vector3(0,1,0));this.add(f);var g=new THREE.PerspectiveCamera(90,1,a,b);g.up.set(0,0,-1);g.lookAt(new THREE.Vector3(0,-1,0));this.add(g);var h=new THREE.PerspectiveCamera(90,
1,a,b);h.up.set(0,-1,0);h.lookAt(new THREE.Vector3(0,0,1));this.add(h);var j=new THREE.PerspectiveCamera(90,1,a,b);j.up.set(0,-1,0);j.lookAt(new THREE.Vector3(0,0,-1));this.add(j);this.renderTarget=new THREE.WebGLRenderTargetCube(c,c,{format:THREE.RGBFormat,magFilter:THREE.LinearFilter,minFilter:THREE.LinearFilter});this.updateCubeMap=function(a,b){var c=this.renderTarget,m=c.generateMipmaps;c.generateMipmaps=false;c.activeCubeFace=0;a.render(b,d,c);c.activeCubeFace=1;a.render(b,e,c);c.activeCubeFace=
2;a.render(b,f,c);c.activeCubeFace=3;a.render(b,g,c);c.activeCubeFace=4;a.render(b,h,c);c.generateMipmaps=m;c.activeCubeFace=5;a.render(b,j,c)}};THREE.CubeCamera.prototype=new THREE.Object3D;THREE.CubeCamera.prototype.constructor=THREE.CubeCamera;
THREE.CombinedCamera=function(a,b,c,d,e,f,g){THREE.Camera.call(this);this.fov=c;this.left=-a/2;this.right=a/2;this.top=b/2;this.bottom=-b/2;this.cameraO=new THREE.OrthographicCamera(a/-2,a/2,b/2,b/-2,f,g);this.cameraP=new THREE.PerspectiveCamera(c,a/b,d,e);this.zoom=1;this.toPerspective()};THREE.CombinedCamera.prototype=new THREE.Camera;THREE.CombinedCamera.prototype.constructor=THREE.CombinedCamera;
THREE.CombinedCamera.prototype.toPerspective=function(){this.near=this.cameraP.near;this.far=this.cameraP.far;this.cameraP.fov=this.fov/this.zoom;this.cameraP.updateProjectionMatrix();this.projectionMatrix=this.cameraP.projectionMatrix;this.inPersepectiveMode=true;this.inOrthographicMode=false};
THREE.CombinedCamera.prototype.toOrthographic=function(){var a=this.cameraP.aspect,b=(this.cameraP.near+this.cameraP.far)/2,b=Math.tan(this.fov/2)*b,a=2*b*a/2,b=b/this.zoom,a=a/this.zoom;this.cameraO.left=-a;this.cameraO.right=a;this.cameraO.top=b;this.cameraO.bottom=-b;this.cameraO.updateProjectionMatrix();this.near=this.cameraO.near;this.far=this.cameraO.far;this.projectionMatrix=this.cameraO.projectionMatrix;this.inPersepectiveMode=false;this.inOrthographicMode=true};
THREE.CombinedCamera.prototype.setSize=function(a,b){this.cameraP.aspect=a/b;this.left=-a/2;this.right=a/2;this.top=b/2;this.bottom=-b/2};THREE.CombinedCamera.prototype.setFov=function(a){this.fov=a;this.inPersepectiveMode?this.toPerspective():this.toOrthographic()};THREE.CombinedCamera.prototype.updateProjectionMatrix=function(){if(this.inPersepectiveMode)this.toPerspective();else{this.toPerspective();this.toOrthographic()}};
THREE.CombinedCamera.prototype.setLens=function(a,b){var c=2*Math.atan((b!==void 0?b:24)/(a*2))*(180/Math.PI);this.setFov(c);return c};THREE.CombinedCamera.prototype.setZoom=function(a){this.zoom=a;this.inPersepectiveMode?this.toPerspective():this.toOrthographic()};THREE.CombinedCamera.prototype.toFrontView=function(){this.rotation.x=0;this.rotation.y=0;this.rotation.z=0;this.rotationAutoUpdate=false};
THREE.CombinedCamera.prototype.toBackView=function(){this.rotation.x=0;this.rotation.y=Math.PI;this.rotation.z=0;this.rotationAutoUpdate=false};THREE.CombinedCamera.prototype.toLeftView=function(){this.rotation.x=0;this.rotation.y=-Math.PI/2;this.rotation.z=0;this.rotationAutoUpdate=false};THREE.CombinedCamera.prototype.toRightView=function(){this.rotation.x=0;this.rotation.y=Math.PI/2;this.rotation.z=0;this.rotationAutoUpdate=false};
THREE.CombinedCamera.prototype.toTopView=function(){this.rotation.x=-Math.PI/2;this.rotation.y=0;this.rotation.z=0;this.rotationAutoUpdate=false};THREE.CombinedCamera.prototype.toBottomView=function(){this.rotation.x=Math.PI/2;this.rotation.y=0;this.rotation.z=0;this.rotationAutoUpdate=false};
THREE.FirstPersonControls=function(a,b){function c(a,b){return function(){b.apply(a,arguments)}}this.object=a;this.target=new THREE.Vector3(0,0,0);this.domElement=b!==void 0?b:document;this.movementSpeed=1;this.lookSpeed=0.005;this.noFly=false;this.lookVertical=true;this.autoForward=false;this.activeLook=true;this.heightSpeed=false;this.heightCoef=1;this.heightMin=0;this.constrainVertical=false;this.verticalMin=0;this.verticalMax=Math.PI;this.theta=this.phi=this.lon=this.lat=this.mouseY=this.mouseX=
this.autoSpeedFactor=0;this.mouseDragOn=this.freeze=this.moveRight=this.moveLeft=this.moveBackward=this.moveForward=false;if(this.domElement===document){this.viewHalfX=window.innerWidth/2;this.viewHalfY=window.innerHeight/2}else{this.viewHalfX=this.domElement.offsetWidth/2;this.viewHalfY=this.domElement.offsetHeight/2;this.domElement.setAttribute("tabindex",-1)}this.onMouseDown=function(a){this.domElement!==document&&this.domElement.focus();a.preventDefault();a.stopPropagation();if(this.activeLook)switch(a.button){case 0:this.moveForward=
true;break;case 2:this.moveBackward=true}this.mouseDragOn=true};this.onMouseUp=function(a){a.preventDefault();a.stopPropagation();if(this.activeLook)switch(a.button){case 0:this.moveForward=false;break;case 2:this.moveBackward=false}this.mouseDragOn=false};this.onMouseMove=function(a){if(this.domElement===document){this.mouseX=a.pageX-this.viewHalfX;this.mouseY=a.pageY-this.viewHalfY}else{this.mouseX=a.pageX-this.domElement.offsetLeft-this.viewHalfX;this.mouseY=a.pageY-this.domElement.offsetTop-this.viewHalfY}};
this.onKeyDown=function(a){switch(a.keyCode){case 38:case 87:this.moveForward=true;break;case 37:case 65:this.moveLeft=true;break;case 40:case 83:this.moveBackward=true;break;case 39:case 68:this.moveRight=true;break;case 82:this.moveUp=true;break;case 70:this.moveDown=true;break;case 81:this.freeze=!this.freeze}};this.onKeyUp=function(a){switch(a.keyCode){case 38:case 87:this.moveForward=false;break;case 37:case 65:this.moveLeft=false;break;case 40:case 83:this.moveBackward=false;break;case 39:case 68:this.moveRight=
false;break;case 82:this.moveUp=false;break;case 70:this.moveDown=false}};this.update=function(a){var b=0;if(!this.freeze){if(this.heightSpeed){b=THREE.Math.clamp(this.object.position.y,this.heightMin,this.heightMax)-this.heightMin;this.autoSpeedFactor=a*b*this.heightCoef}else this.autoSpeedFactor=0;b=a*this.movementSpeed;(this.moveForward||this.autoForward&&!this.moveBackward)&&this.object.translateZ(-(b+this.autoSpeedFactor));this.moveBackward&&this.object.translateZ(b);this.moveLeft&&this.object.translateX(-b);
this.moveRight&&this.object.translateX(b);this.moveUp&&this.object.translateY(b);this.moveDown&&this.object.translateY(-b);a=a*this.lookSpeed;this.activeLook||(a=0);this.lon=this.lon+this.mouseX*a;if(this.lookVertical)this.lat=this.lat-this.mouseY*a;this.lat=Math.max(-85,Math.min(85,this.lat));this.phi=(90-this.lat)*Math.PI/180;this.theta=this.lon*Math.PI/180;var b=this.target,c=this.object.position;b.x=c.x+100*Math.sin(this.phi)*Math.cos(this.theta);b.y=c.y+100*Math.cos(this.phi);b.z=c.z+100*Math.sin(this.phi)*
Math.sin(this.theta);b=1;this.constrainVertical&&(b=Math.PI/(this.verticalMax-this.verticalMin));this.lon=this.lon+this.mouseX*a;if(this.lookVertical)this.lat=this.lat-this.mouseY*a*b;this.lat=Math.max(-85,Math.min(85,this.lat));this.phi=(90-this.lat)*Math.PI/180;this.theta=this.lon*Math.PI/180;if(this.constrainVertical)this.phi=THREE.Math.mapLinear(this.phi,0,Math.PI,this.verticalMin,this.verticalMax);b=this.target;c=this.object.position;b.x=c.x+100*Math.sin(this.phi)*Math.cos(this.theta);b.y=c.y+
100*Math.cos(this.phi);b.z=c.z+100*Math.sin(this.phi)*Math.sin(this.theta);this.object.lookAt(b)}};this.domElement.addEventListener("contextmenu",function(a){a.preventDefault()},false);this.domElement.addEventListener("mousemove",c(this,this.onMouseMove),false);this.domElement.addEventListener("mousedown",c(this,this.onMouseDown),false);this.domElement.addEventListener("mouseup",c(this,this.onMouseUp),false);this.domElement.addEventListener("keydown",c(this,this.onKeyDown),false);this.domElement.addEventListener("keyup",
c(this,this.onKeyUp),false)};
THREE.PathControls=function(a,b){function c(a){return(a=a*2)<1?0.5*a*a:-0.5*(--a*(a-2)-1)}function d(a,b){return function(){b.apply(a,arguments)}}function e(a,b,c,d){var e={name:c,fps:0.6,length:d,hierarchy:[]},f,g=b.getControlPointsArray(),h=b.getLength(),q=g.length,u=0;f=q-1;b={parent:-1,keys:[]};b.keys[0]={time:0,pos:g[0],rot:[0,0,0,1],scl:[1,1,1]};b.keys[f]={time:d,pos:g[f],rot:[0,0,0,1],scl:[1,1,1]};for(f=1;f<q-1;f++){u=d*h.chunks[f]/h.total;b.keys[f]={time:u,pos:g[f]}}e.hierarchy[0]=b;THREE.AnimationHandler.add(e);
return new THREE.Animation(a,c,THREE.AnimationHandler.CATMULLROM_FORWARD,false)}function f(a,b){var c,d,e=new THREE.Geometry;for(c=0;c<a.points.length*b;c++){d=c/(a.points.length*b);d=a.getPoint(d);e.vertices[c]=new THREE.Vector3(d.x,d.y,d.z)}return e}this.object=a;this.domElement=b!==void 0?b:document;this.id="PathControls"+THREE.PathControlsIdCounter++;this.duration=1E4;this.waypoints=[];this.useConstantSpeed=true;this.resamplingCoef=50;this.debugPath=new THREE.Object3D;this.debugDummy=new THREE.Object3D;
this.animationParent=new THREE.Object3D;this.lookSpeed=0.005;this.lookHorizontal=this.lookVertical=true;this.verticalAngleMap={srcRange:[0,2*Math.PI],dstRange:[0,2*Math.PI]};this.horizontalAngleMap={srcRange:[0,2*Math.PI],dstRange:[0,2*Math.PI]};this.target=new THREE.Object3D;this.theta=this.phi=this.lon=this.lat=this.mouseY=this.mouseX=0;if(this.domElement===document){this.viewHalfX=window.innerWidth/2;this.viewHalfY=window.innerHeight/2}else{this.viewHalfX=this.domElement.offsetWidth/2;this.viewHalfY=
this.domElement.offsetHeight/2;this.domElement.setAttribute("tabindex",-1)}var g=Math.PI*2,h=Math.PI/180;this.update=function(a){var b;if(this.lookHorizontal)this.lon=this.lon+this.mouseX*this.lookSpeed*a;if(this.lookVertical)this.lat=this.lat-this.mouseY*this.lookSpeed*a;this.lon=Math.max(0,Math.min(360,this.lon));this.lat=Math.max(-85,Math.min(85,this.lat));this.phi=(90-this.lat)*h;this.theta=this.lon*h;a=this.phi%g;this.phi=a>=0?a:a+g;b=this.verticalAngleMap.srcRange;a=this.verticalAngleMap.dstRange;
b=THREE.Math.mapLinear(this.phi,b[0],b[1],a[0],a[1]);var d=a[1]-a[0];this.phi=c((b-a[0])/d)*d+a[0];b=this.horizontalAngleMap.srcRange;a=this.horizontalAngleMap.dstRange;b=THREE.Math.mapLinear(this.theta,b[0],b[1],a[0],a[1]);d=a[1]-a[0];this.theta=c((b-a[0])/d)*d+a[0];a=this.target.position;a.x=100*Math.sin(this.phi)*Math.cos(this.theta);a.y=100*Math.cos(this.phi);a.z=100*Math.sin(this.phi)*Math.sin(this.theta);this.object.lookAt(this.target.position)};this.onMouseMove=function(a){if(this.domElement===
document){this.mouseX=a.pageX-this.viewHalfX;this.mouseY=a.pageY-this.viewHalfY}else{this.mouseX=a.pageX-this.domElement.offsetLeft-this.viewHalfX;this.mouseY=a.pageY-this.domElement.offsetTop-this.viewHalfY}};this.init=function(){this.spline=new THREE.Spline;this.spline.initFromArray(this.waypoints);this.useConstantSpeed&&this.spline.reparametrizeByArcLength(this.resamplingCoef);if(this.createDebugDummy){var a=new THREE.MeshLambertMaterial({color:30719}),b=new THREE.MeshLambertMaterial({color:65280}),
c=new THREE.CubeGeometry(10,10,20),g=new THREE.CubeGeometry(2,2,10);this.animationParent=new THREE.Mesh(c,a);a=new THREE.Mesh(g,b);a.position.set(0,10,0);this.animation=e(this.animationParent,this.spline,this.id,this.duration);this.animationParent.add(this.object);this.animationParent.add(this.target);this.animationParent.add(a)}else{this.animation=e(this.animationParent,this.spline,this.id,this.duration);this.animationParent.add(this.target);this.animationParent.add(this.object)}if(this.createDebugPath){var a=
this.debugPath,b=this.spline,g=f(b,10),c=f(b,10),h=new THREE.LineBasicMaterial({color:16711680,linewidth:3}),g=new THREE.Line(g,h),c=new THREE.ParticleSystem(c,new THREE.ParticleBasicMaterial({color:16755200,size:3}));g.scale.set(1,1,1);a.add(g);c.scale.set(1,1,1);a.add(c);for(var g=new THREE.SphereGeometry(1,16,8),h=new THREE.MeshBasicMaterial({color:65280}),p=0;p<b.points.length;p++){c=new THREE.Mesh(g,h);c.position.copy(b.points[p]);a.add(c)}}this.domElement.addEventListener("mousemove",d(this,
this.onMouseMove),false)}};THREE.PathControlsIdCounter=0;
THREE.FlyControls=function(a,b){function c(a,b){return function(){b.apply(a,arguments)}}this.object=a;this.domElement=b!==void 0?b:document;b&&this.domElement.setAttribute("tabindex",-1);this.movementSpeed=1;this.rollSpeed=0.005;this.autoForward=this.dragToLook=false;this.object.useQuaternion=true;this.tmpQuaternion=new THREE.Quaternion;this.mouseStatus=0;this.moveState={up:0,down:0,left:0,right:0,forward:0,back:0,pitchUp:0,pitchDown:0,yawLeft:0,yawRight:0,rollLeft:0,rollRight:0};this.moveVector=
new THREE.Vector3(0,0,0);this.rotationVector=new THREE.Vector3(0,0,0);this.handleEvent=function(a){if(typeof this[a.type]=="function")this[a.type](a)};this.keydown=function(a){if(!a.altKey){switch(a.keyCode){case 16:this.movementSpeedMultiplier=0.1;break;case 87:this.moveState.forward=1;break;case 83:this.moveState.back=1;break;case 65:this.moveState.left=1;break;case 68:this.moveState.right=1;break;case 82:this.moveState.up=1;break;case 70:this.moveState.down=1;break;case 38:this.moveState.pitchUp=
1;break;case 40:this.moveState.pitchDown=1;break;case 37:this.moveState.yawLeft=1;break;case 39:this.moveState.yawRight=1;break;case 81:this.moveState.rollLeft=1;break;case 69:this.moveState.rollRight=1}this.updateMovementVector();this.updateRotationVector()}};this.keyup=function(a){switch(a.keyCode){case 16:this.movementSpeedMultiplier=1;break;case 87:this.moveState.forward=0;break;case 83:this.moveState.back=0;break;case 65:this.moveState.left=0;break;case 68:this.moveState.right=0;break;case 82:this.moveState.up=
0;break;case 70:this.moveState.down=0;break;case 38:this.moveState.pitchUp=0;break;case 40:this.moveState.pitchDown=0;break;case 37:this.moveState.yawLeft=0;break;case 39:this.moveState.yawRight=0;break;case 81:this.moveState.rollLeft=0;break;case 69:this.moveState.rollRight=0}this.updateMovementVector();this.updateRotationVector()};this.mousedown=function(a){this.domElement!==document&&this.domElement.focus();a.preventDefault();a.stopPropagation();if(this.dragToLook)this.mouseStatus++;else switch(a.button){case 0:this.object.moveForward=
true;break;case 2:this.object.moveBackward=true}};this.mousemove=function(a){if(!this.dragToLook||this.mouseStatus>0){var b=this.getContainerDimensions(),c=b.size[0]/2,g=b.size[1]/2;this.moveState.yawLeft=-(a.pageX-b.offset[0]-c)/c;this.moveState.pitchDown=(a.pageY-b.offset[1]-g)/g;this.updateRotationVector()}};this.mouseup=function(a){a.preventDefault();a.stopPropagation();if(this.dragToLook){this.mouseStatus--;this.moveState.yawLeft=this.moveState.pitchDown=0}else switch(a.button){case 0:this.moveForward=
false;break;case 2:this.moveBackward=false}this.updateRotationVector()};this.update=function(a){var b=a*this.movementSpeed,a=a*this.rollSpeed;this.object.translateX(this.moveVector.x*b);this.object.translateY(this.moveVector.y*b);this.object.translateZ(this.moveVector.z*b);this.tmpQuaternion.set(this.rotationVector.x*a,this.rotationVector.y*a,this.rotationVector.z*a,1).normalize();this.object.quaternion.multiplySelf(this.tmpQuaternion);this.object.matrix.setPosition(this.object.position);this.object.matrix.setRotationFromQuaternion(this.object.quaternion);
this.object.matrixWorldNeedsUpdate=true};this.updateMovementVector=function(){var a=this.moveState.forward||this.autoForward&&!this.moveState.back?1:0;this.moveVector.x=-this.moveState.left+this.moveState.right;this.moveVector.y=-this.moveState.down+this.moveState.up;this.moveVector.z=-a+this.moveState.back};this.updateRotationVector=function(){this.rotationVector.x=-this.moveState.pitchDown+this.moveState.pitchUp;this.rotationVector.y=-this.moveState.yawRight+this.moveState.yawLeft;this.rotationVector.z=
-this.moveState.rollRight+this.moveState.rollLeft};this.getContainerDimensions=function(){return this.domElement!=document?{size:[this.domElement.offsetWidth,this.domElement.offsetHeight],offset:[this.domElement.offsetLeft,this.domElement.offsetTop]}:{size:[window.innerWidth,window.innerHeight],offset:[0,0]}};this.domElement.addEventListener("mousemove",c(this,this.mousemove),false);this.domElement.addEventListener("mousedown",c(this,this.mousedown),false);this.domElement.addEventListener("mouseup",
c(this,this.mouseup),false);this.domElement.addEventListener("keydown",c(this,this.keydown),false);this.domElement.addEventListener("keyup",c(this,this.keyup),false);this.updateMovementVector();this.updateRotationVector()};
THREE.RollControls=function(a,b){this.object=a;this.domElement=b!==void 0?b:document;this.mouseLook=true;this.autoForward=false;this.rollSpeed=this.movementSpeed=this.lookSpeed=1;this.constrainVertical=[-0.9,0.9];this.object.matrixAutoUpdate=false;this.forward=new THREE.Vector3(0,0,1);this.roll=0;var c=new THREE.Vector3,d=new THREE.Vector3,e=new THREE.Vector3,f=new THREE.Matrix4,g=false,h=1,j=0,k=0,l=0,o=0,m=0,p=window.innerWidth/2,r=window.innerHeight/2;this.update=function(a){if(this.mouseLook){var b=
a*this.lookSpeed;this.rotateHorizontally(b*o);this.rotateVertically(b*m)}b=a*this.movementSpeed;this.object.translateZ(-b*(j>0||this.autoForward&&!(j<0)?1:j));this.object.translateX(b*k);this.object.translateY(b*l);if(g)this.roll=this.roll+this.rollSpeed*a*h;if(this.forward.y>this.constrainVertical[1]){this.forward.y=this.constrainVertical[1];this.forward.normalize()}else if(this.forward.y<this.constrainVertical[0]){this.forward.y=this.constrainVertical[0];this.forward.normalize()}e.copy(this.forward);
d.set(0,1,0);c.cross(d,e).normalize();d.cross(e,c).normalize();this.object.matrix.elements[0]=c.x;this.object.matrix.elements[4]=d.x;this.object.matrix.elements[8]=e.x;this.object.matrix.elements[1]=c.y;this.object.matrix.elements[5]=d.y;this.object.matrix.elements[9]=e.y;this.object.matrix.elements[2]=c.z;this.object.matrix.elements[6]=d.z;this.object.matrix.elements[10]=e.z;f.identity();f.elements[0]=Math.cos(this.roll);f.elements[4]=-Math.sin(this.roll);f.elements[1]=Math.sin(this.roll);f.elements[5]=
Math.cos(this.roll);this.object.matrix.multiplySelf(f);this.object.matrixWorldNeedsUpdate=true;this.object.matrix.elements[12]=this.object.position.x;this.object.matrix.elements[13]=this.object.position.y;this.object.matrix.elements[14]=this.object.position.z};this.translateX=function(a){this.object.position.x=this.object.position.x+this.object.matrix.elements[0]*a;this.object.position.y=this.object.position.y+this.object.matrix.elements[1]*a;this.object.position.z=this.object.position.z+this.object.matrix.elements[2]*
a};this.translateY=function(a){this.object.position.x=this.object.position.x+this.object.matrix.elements[4]*a;this.object.position.y=this.object.position.y+this.object.matrix.elements[5]*a;this.object.position.z=this.object.position.z+this.object.matrix.elements[6]*a};this.translateZ=function(a){this.object.position.x=this.object.position.x-this.object.matrix.elements[8]*a;this.object.position.y=this.object.position.y-this.object.matrix.elements[9]*a;this.object.position.z=this.object.position.z-
this.object.matrix.elements[10]*a};this.rotateHorizontally=function(a){c.set(this.object.matrix.elements[0],this.object.matrix.elements[1],this.object.matrix.elements[2]);c.multiplyScalar(a);this.forward.subSelf(c);this.forward.normalize()};this.rotateVertically=function(a){d.set(this.object.matrix.elements[4],this.object.matrix.elements[5],this.object.matrix.elements[6]);d.multiplyScalar(a);this.forward.addSelf(d);this.forward.normalize()};this.domElement.addEventListener("contextmenu",function(a){a.preventDefault()},
false);this.domElement.addEventListener("mousemove",function(a){o=(a.clientX-p)/window.innerWidth;m=(a.clientY-r)/window.innerHeight},false);this.domElement.addEventListener("mousedown",function(a){a.preventDefault();a.stopPropagation();switch(a.button){case 0:j=1;break;case 2:j=-1}},false);this.domElement.addEventListener("mouseup",function(a){a.preventDefault();a.stopPropagation();switch(a.button){case 0:j=0;break;case 2:j=0}},false);this.domElement.addEventListener("keydown",function(a){switch(a.keyCode){case 38:case 87:j=
1;break;case 37:case 65:k=-1;break;case 40:case 83:j=-1;break;case 39:case 68:k=1;break;case 81:g=true;h=1;break;case 69:g=true;h=-1;break;case 82:l=1;break;case 70:l=-1}},false);this.domElement.addEventListener("keyup",function(a){switch(a.keyCode){case 38:case 87:j=0;break;case 37:case 65:k=0;break;case 40:case 83:j=0;break;case 39:case 68:k=0;break;case 81:g=false;break;case 69:g=false;break;case 82:l=0;break;case 70:l=0}},false)};
THREE.TrackballControls=function(a,b){THREE.EventTarget.call(this);var c=this;this.object=a;this.domElement=b!==void 0?b:document;this.enabled=true;this.screen={width:window.innerWidth,height:window.innerHeight,offsetLeft:0,offsetTop:0};this.radius=(this.screen.width+this.screen.height)/4;this.rotateSpeed=1;this.zoomSpeed=1.2;this.panSpeed=0.3;this.staticMoving=this.noPan=this.noZoom=this.noRotate=false;this.dynamicDampingFactor=0.2;this.minDistance=0;this.maxDistance=Infinity;this.keys=[65,83,68];
this.target=new THREE.Vector3;var d=new THREE.Vector3,e=false,f=-1,g=new THREE.Vector3,h=new THREE.Vector3,j=new THREE.Vector3,k=new THREE.Vector2,l=new THREE.Vector2,o=new THREE.Vector2,m=new THREE.Vector2,p={type:"change"};this.handleEvent=function(a){if(typeof this[a.type]=="function")this[a.type](a)};this.getMouseOnScreen=function(a,b){return new THREE.Vector2((a-c.screen.offsetLeft)/c.radius*0.5,(b-c.screen.offsetTop)/c.radius*0.5)};this.getMouseProjectionOnBall=function(a,b){var d=new THREE.Vector3((a-
c.screen.width*0.5-c.screen.offsetLeft)/c.radius,(c.screen.height*0.5+c.screen.offsetTop-b)/c.radius,0),e=d.length();e>1?d.normalize():d.z=Math.sqrt(1-e*e);g.copy(c.object.position).subSelf(c.target);e=c.object.up.clone().setLength(d.y);e.addSelf(c.object.up.clone().crossSelf(g).setLength(d.x));e.addSelf(g.setLength(d.z));return e};this.rotateCamera=function(){var a=Math.acos(h.dot(j)/h.length()/j.length());if(a){var b=(new THREE.Vector3).cross(h,j).normalize(),d=new THREE.Quaternion,a=a*c.rotateSpeed;
d.setFromAxisAngle(b,-a);d.multiplyVector3(g);d.multiplyVector3(c.object.up);d.multiplyVector3(j);if(c.staticMoving)h=j;else{d.setFromAxisAngle(b,a*(c.dynamicDampingFactor-1));d.multiplyVector3(h)}}};this.zoomCamera=function(){var a=1+(l.y-k.y)*c.zoomSpeed;if(a!==1&&a>0){g.multiplyScalar(a);c.staticMoving?k=l:k.y=k.y+(l.y-k.y)*this.dynamicDampingFactor}};this.panCamera=function(){var a=m.clone().subSelf(o);if(a.lengthSq()){a.multiplyScalar(g.length()*c.panSpeed);var b=g.clone().crossSelf(c.object.up).setLength(a.x);
b.addSelf(c.object.up.clone().setLength(a.y));c.object.position.addSelf(b);c.target.addSelf(b);c.staticMoving?o=m:o.addSelf(a.sub(m,o).multiplyScalar(c.dynamicDampingFactor))}};this.checkDistances=function(){if(!c.noZoom||!c.noPan){c.object.position.lengthSq()>c.maxDistance*c.maxDistance&&c.object.position.setLength(c.maxDistance);g.lengthSq()<c.minDistance*c.minDistance&&c.object.position.add(c.target,g.setLength(c.minDistance))}};this.update=function(){g.copy(c.object.position).subSelf(c.target);
c.noRotate||c.rotateCamera();c.noZoom||c.zoomCamera();c.noPan||c.panCamera();c.object.position.add(c.target,g);c.checkDistances();c.object.lookAt(c.target);if(d.distanceTo(c.object.position)>0){c.dispatchEvent(p);d.copy(c.object.position)}};this.domElement.addEventListener("contextmenu",function(a){a.preventDefault()},false);this.domElement.addEventListener("mousemove",function(a){if(c.enabled){if(e){h=j=c.getMouseProjectionOnBall(a.clientX,a.clientY);k=l=c.getMouseOnScreen(a.clientX,a.clientY);o=
m=c.getMouseOnScreen(a.clientX,a.clientY);e=false}f!==-1&&(f===0&&!c.noRotate?j=c.getMouseProjectionOnBall(a.clientX,a.clientY):f===1&&!c.noZoom?l=c.getMouseOnScreen(a.clientX,a.clientY):f===2&&!c.noPan&&(m=c.getMouseOnScreen(a.clientX,a.clientY)))}},false);this.domElement.addEventListener("mousedown",function(a){if(c.enabled){a.preventDefault();a.stopPropagation();if(f===-1){f=a.button;f===0&&!c.noRotate?h=j=c.getMouseProjectionOnBall(a.clientX,a.clientY):f===1&&!c.noZoom?k=l=c.getMouseOnScreen(a.clientX,
a.clientY):this.noPan||(o=m=c.getMouseOnScreen(a.clientX,a.clientY))}}},false);this.domElement.addEventListener("mouseup",function(a){if(c.enabled){a.preventDefault();a.stopPropagation();f=-1}},false);window.addEventListener("keydown",function(a){if(c.enabled&&f===-1){a.keyCode===c.keys[0]&&!c.noRotate?f=0:a.keyCode===c.keys[1]&&!c.noZoom?f=1:a.keyCode===c.keys[2]&&!c.noPan&&(f=2);f!==-1&&(e=true)}},false);window.addEventListener("keyup",function(){c.enabled&&f!==-1&&(f=-1)},false)};
THREE.OrbitControls=function(a,b){function c(){return 2*Math.PI/60/60*d.autoRotateSpeed}this.object=a;this.domElement=b!==void 0?b:document;this.center=new THREE.Vector3(0,0,0);this.userZoom=true;this.userZoomSpeed=1;this.userRotate=true;this.userRotateSpeed=1;this.autoRotate=false;this.autoRotateSpeed=2;var d=this,e=new THREE.Vector2,f=new THREE.Vector2,g=new THREE.Vector2,h=false,j=0,k=0,l=1;this.rotateLeft=function(a){a===void 0&&(a=c());k=k-a};this.rotateRight=function(a){a===void 0&&(a=c());
k=k+a};this.rotateUp=function(a){a===void 0&&(a=c());j=j-a};this.rotateDown=function(a){a===void 0&&(a=c());j=j+a};this.zoomIn=function(a){a===void 0&&(a=Math.pow(0.95,d.userZoomSpeed));l=l/a};this.zoomOut=function(a){a===void 0&&(a=Math.pow(0.95,d.userZoomSpeed));l=l*a};this.update=function(){var a=this.object.position,b=a.clone().subSelf(this.center),d=Math.atan2(b.x,b.z),e=Math.atan2(Math.sqrt(b.x*b.x+b.z*b.z),b.y);this.autoRotate&&this.rotateLeft(c());var d=d+k,e=e+j,e=Math.max(1.0E-6,Math.min(Math.PI-
1.0E-6,e)),f=b.length();b.x=f*Math.sin(e)*Math.sin(d);b.y=f*Math.cos(e);b.z=f*Math.sin(e)*Math.cos(d);b.multiplyScalar(l);a.copy(this.center).addSelf(b);this.object.lookAt(this.center);j=k=0;l=1};this.domElement.addEventListener("contextmenu",function(a){a.preventDefault()},false);this.domElement.addEventListener("mousemove",function(a){if(h){f.set(a.clientX,a.clientY);g.sub(f,e);d.rotateLeft(2*Math.PI*g.x/1800*d.userRotateSpeed);d.rotateUp(2*Math.PI*g.y/1800*d.userRotateSpeed);e.copy(f)}},false);
this.domElement.addEventListener("mousedown",function(a){if(d.userRotate){e.set(a.clientX,a.clientY);h=true}},false);this.domElement.addEventListener("mouseup",function(){d.userRotate&&(h=false)},false);this.domElement.addEventListener("mousewheel",function(a){d.userZoom&&(a.wheelDelta>0?d.zoomOut():d.zoomIn())},false)};
THREE.CubeGeometry=function(a,b,c,d,e,f,g,h){function j(a,b,c,g,h,j,l,m){var n,o=d||1,p=e||1,q=h/2,r=j/2,t=k.vertices.length;if(a==="x"&&b==="y"||a==="y"&&b==="x")n="z";else if(a==="x"&&b==="z"||a==="z"&&b==="x"){n="y";p=f||1}else if(a==="z"&&b==="y"||a==="y"&&b==="z"){n="x";o=f||1}var u=o+1,i=p+1,y=h/o,L=j/p,S=new THREE.Vector3;S[n]=l>0?1:-1;for(h=0;h<i;h++)for(j=0;j<u;j++){var aa=new THREE.Vector3;aa[a]=(j*y-q)*c;aa[b]=(h*L-r)*g;aa[n]=l;k.vertices.push(aa)}for(h=0;h<p;h++)for(j=0;j<o;j++){a=new THREE.Face4(j+
u*h+t,j+u*(h+1)+t,j+1+u*(h+1)+t,j+1+u*h+t);a.normal.copy(S);a.vertexNormals.push(S.clone(),S.clone(),S.clone(),S.clone());a.materialIndex=m;k.faces.push(a);k.faceVertexUvs[0].push([new THREE.UV(j/o,h/p),new THREE.UV(j/o,(h+1)/p),new THREE.UV((j+1)/o,(h+1)/p),new THREE.UV((j+1)/o,h/p)])}}THREE.Geometry.call(this);var k=this,l=a/2,o=b/2,m=c/2,p,r,n,q,u,t;if(g!==void 0){if(g instanceof Array)this.materials=g;else{this.materials=[];for(p=0;p<6;p++)this.materials.push(g)}p=0;q=1;r=2;u=3;n=4;t=5}else this.materials=
[];this.sides={px:true,nx:true,py:true,ny:true,pz:true,nz:true};if(h!=void 0)for(var y in h)this.sides[y]!==void 0&&(this.sides[y]=h[y]);this.sides.px&&j("z","y",-1,-1,c,b,l,p);this.sides.nx&&j("z","y",1,-1,c,b,-l,q);this.sides.py&&j("x","z",1,1,a,c,o,r);this.sides.ny&&j("x","z",1,-1,a,c,-o,u);this.sides.pz&&j("x","y",1,-1,a,b,m,n);this.sides.nz&&j("x","y",-1,-1,a,b,-m,t);this.computeCentroids();this.mergeVertices()};THREE.CubeGeometry.prototype=new THREE.Geometry;
THREE.CubeGeometry.prototype.constructor=THREE.CubeGeometry;
THREE.CylinderGeometry=function(a,b,c,d,e,f){THREE.Geometry.call(this);var a=a!==void 0?a:20,b=b!==void 0?b:20,c=c!==void 0?c:100,g=c/2,d=d||8,e=e||1,h,j,k=[],l=[];for(j=0;j<=e;j++){var o=[],m=[],p=j/e,r=p*(b-a)+a;for(h=0;h<=d;h++){var n=h/d,q=new THREE.Vector3;q.x=r*Math.sin(n*Math.PI*2);q.y=-p*c+g;q.z=r*Math.cos(n*Math.PI*2);this.vertices.push(q);o.push(this.vertices.length-1);m.push(new THREE.UV(n,p))}k.push(o);l.push(m)}c=(b-a)/c;for(h=0;h<d;h++){if(a!==0){o=this.vertices[k[0][h]].clone();m=this.vertices[k[0][h+
1]].clone()}else{o=this.vertices[k[1][h]].clone();m=this.vertices[k[1][h+1]].clone()}o.setY(Math.sqrt(o.x*o.x+o.z*o.z)*c).normalize();m.setY(Math.sqrt(m.x*m.x+m.z*m.z)*c).normalize();for(j=0;j<e;j++){var p=k[j][h],r=k[j+1][h],n=k[j+1][h+1],q=k[j][h+1],u=o.clone(),t=o.clone(),y=m.clone(),s=m.clone(),x=l[j][h].clone(),E=l[j+1][h].clone(),D=l[j+1][h+1].clone(),A=l[j][h+1].clone();this.faces.push(new THREE.Face4(p,r,n,q,[u,t,y,s]));this.faceVertexUvs[0].push([x,E,D,A])}}if(!f&&a>0){this.vertices.push(new THREE.Vector3(0,
g,0));for(h=0;h<d;h++){p=k[0][h];r=k[0][h+1];n=this.vertices.length-1;u=new THREE.Vector3(0,1,0);t=new THREE.Vector3(0,1,0);y=new THREE.Vector3(0,1,0);x=l[0][h].clone();E=l[0][h+1].clone();D=new THREE.UV(E.u,0);this.faces.push(new THREE.Face3(p,r,n,[u,t,y]));this.faceVertexUvs[0].push([x,E,D])}}if(!f&&b>0){this.vertices.push(new THREE.Vector3(0,-g,0));for(h=0;h<d;h++){p=k[j][h+1];r=k[j][h];n=this.vertices.length-1;u=new THREE.Vector3(0,-1,0);t=new THREE.Vector3(0,-1,0);y=new THREE.Vector3(0,-1,0);
x=l[j][h+1].clone();E=l[j][h].clone();D=new THREE.UV(E.u,1);this.faces.push(new THREE.Face3(p,r,n,[u,t,y]));this.faceVertexUvs[0].push([x,E,D])}}this.computeCentroids();this.computeFaceNormals()};THREE.CylinderGeometry.prototype=new THREE.Geometry;THREE.CylinderGeometry.prototype.constructor=THREE.CylinderGeometry;
THREE.ExtrudeGeometry=function(a,b){if(typeof a!=="undefined"){THREE.Geometry.call(this);a=a instanceof Array?a:[a];this.shapebb=a[a.length-1].getBoundingBox();this.addShapeList(a,b);this.computeCentroids();this.computeFaceNormals()}};THREE.ExtrudeGeometry.prototype=new THREE.Geometry;THREE.ExtrudeGeometry.prototype.constructor=THREE.ExtrudeGeometry;THREE.ExtrudeGeometry.prototype.addShapeList=function(a,b){for(var c=a.length,d=0;d<c;d++)this.addShape(a[d],b)};
THREE.ExtrudeGeometry.prototype.addShape=function(a,b){function c(a,b,c){b||console.log("die");return b.clone().multiplyScalar(c).addSelf(a)}function d(a,b,c){var d=THREE.ExtrudeGeometry.__v1,e=THREE.ExtrudeGeometry.__v2,f=THREE.ExtrudeGeometry.__v3,g=THREE.ExtrudeGeometry.__v4,h=THREE.ExtrudeGeometry.__v5,i=THREE.ExtrudeGeometry.__v6;d.set(a.x-b.x,a.y-b.y);e.set(a.x-c.x,a.y-c.y);d=d.normalize();e=e.normalize();f.set(-d.y,d.x);g.set(e.y,-e.x);h.copy(a).addSelf(f);i.copy(a).addSelf(g);if(h.equals(i))return g.clone();
h.copy(b).addSelf(f);i.copy(c).addSelf(g);f=d.dot(g);g=i.subSelf(h).dot(g);if(f===0){console.log("Either infinite or no solutions!");g===0?console.log("Its finite solutions."):console.log("Too bad, no solutions.")}g=g/f;if(g<0){b=Math.atan2(b.y-a.y,b.x-a.x);a=Math.atan2(c.y-a.y,c.x-a.x);b>a&&(a=a+Math.PI*2);c=(b+a)/2;a=-Math.cos(c);c=-Math.sin(c);return new THREE.Vector2(a,c)}return d.multiplyScalar(g).addSelf(h).subSelf(a).clone()}function e(c,d){var e,f;for(N=c.length;--N>=0;){e=N;f=N-1;f<0&&(f=
c.length-1);for(var g=0,h=m+l*2,g=0;g<h;g++){var i=L*g,j=L*(g+1),k=d+e+i,i=d+f+i,n=d+f+j,j=d+e+j,o=c,p=g,q=h,r=e,s=f,k=k+M,i=i+M,n=n+M,j=j+M;I.faces.push(new THREE.Face4(k,i,n,j,null,null,t));k=y.generateSideWallUV(I,a,o,b,k,i,n,j,p,q,r,s);I.faceVertexUvs[0].push(k)}}}function f(a,b,c){I.vertices.push(new THREE.Vector3(a,b,c))}function g(c,d,e,f){c=c+M;d=d+M;e=e+M;I.faces.push(new THREE.Face3(c,d,e,null,null,u));c=f?y.generateBottomUV(I,a,b,c,d,e):y.generateTopUV(I,a,b,c,d,e);I.faceVertexUvs[0].push(c)}
var h=b.amount!==void 0?b.amount:100,j=b.bevelThickness!==void 0?b.bevelThickness:6,k=b.bevelSize!==void 0?b.bevelSize:j-2,l=b.bevelSegments!==void 0?b.bevelSegments:3,o=b.bevelEnabled!==void 0?b.bevelEnabled:true,m=b.steps!==void 0?b.steps:1,p=b.bendPath,r=b.extrudePath,n,q=false,u=b.material,t=b.extrudeMaterial,y=b.UVGenerator!==void 0?b.UVGenerator:THREE.ExtrudeGeometry.WorldUVGenerator,s,x,E,D;if(r){n=r.getSpacedPoints(m);q=true;o=false;s=b.frames!==void 0?b.frames:new THREE.TubeGeometry.FrenetFrames(r,
m,false);x=new THREE.Vector3;E=new THREE.Vector3;D=new THREE.Vector3}if(!o)k=j=l=0;var A,v,H,I=this,M=this.vertices.length;p&&a.addWrapPath(p);var r=a.extractPoints(),p=r.shape,R=r.holes;if(r=!THREE.Shape.Utils.isClockWise(p)){p=p.reverse();v=0;for(H=R.length;v<H;v++){A=R[v];THREE.Shape.Utils.isClockWise(A)&&(R[v]=A.reverse())}r=false}var Z=THREE.Shape.Utils.triangulateShape(p,R),B=p;v=0;for(H=R.length;v<H;v++){A=R[v];p=p.concat(A)}var G,Q,C,i,P,L=p.length,S,aa=Z.length,r=[],N=0;C=B.length;G=C-1;
for(Q=N+1;N<C;N++,G++,Q++){G===C&&(G=0);Q===C&&(Q=0);r[N]=d(B[N],B[G],B[Q])}var ca=[],fa,O=r.concat();v=0;for(H=R.length;v<H;v++){A=R[v];fa=[];N=0;C=A.length;G=C-1;for(Q=N+1;N<C;N++,G++,Q++){G===C&&(G=0);Q===C&&(Q=0);fa[N]=d(A[N],A[G],A[Q])}ca.push(fa);O=O.concat(fa)}for(G=0;G<l;G++){C=G/l;i=j*(1-C);Q=k*Math.sin(C*Math.PI/2);N=0;for(C=B.length;N<C;N++){P=c(B[N],r[N],Q);f(P.x,P.y,-i)}v=0;for(H=R.length;v<H;v++){A=R[v];fa=ca[v];N=0;for(C=A.length;N<C;N++){P=c(A[N],fa[N],Q);f(P.x,P.y,-i)}}}Q=k;for(N=
0;N<L;N++){P=o?c(p[N],O[N],Q):p[N];if(q){E.copy(s.normals[0]).multiplyScalar(P.x);x.copy(s.binormals[0]).multiplyScalar(P.y);D.copy(n[0]).addSelf(E).addSelf(x);f(D.x,D.y,D.z)}else f(P.x,P.y,0)}for(C=1;C<=m;C++)for(N=0;N<L;N++){P=o?c(p[N],O[N],Q):p[N];if(q){E.copy(s.normals[C]).multiplyScalar(P.x);x.copy(s.binormals[C]).multiplyScalar(P.y);D.copy(n[C]).addSelf(E).addSelf(x);f(D.x,D.y,D.z)}else f(P.x,P.y,h/m*C)}for(G=l-1;G>=0;G--){C=G/l;i=j*(1-C);Q=k*Math.sin(C*Math.PI/2);N=0;for(C=B.length;N<C;N++){P=
c(B[N],r[N],Q);f(P.x,P.y,h+i)}v=0;for(H=R.length;v<H;v++){A=R[v];fa=ca[v];N=0;for(C=A.length;N<C;N++){P=c(A[N],fa[N],Q);q?f(P.x,P.y+n[m-1].y,n[m-1].x+i):f(P.x,P.y,h+i)}}}(function(){if(o){var a;a=L*0;for(N=0;N<aa;N++){S=Z[N];g(S[2]+a,S[1]+a,S[0]+a,true)}a=m+l*2;a=L*a;for(N=0;N<aa;N++){S=Z[N];g(S[0]+a,S[1]+a,S[2]+a,false)}}else{for(N=0;N<aa;N++){S=Z[N];g(S[2],S[1],S[0],true)}for(N=0;N<aa;N++){S=Z[N];g(S[0]+L*m,S[1]+L*m,S[2]+L*m,false)}}})();(function(){var a=0;e(B,a);a=a+B.length;v=0;for(H=R.length;v<
H;v++){A=R[v];e(A,a);a=a+A.length}})()};
THREE.ExtrudeGeometry.WorldUVGenerator={generateTopUV:function(a,b,c,d,e,f){b=a.vertices[e].x;e=a.vertices[e].y;c=a.vertices[f].x;f=a.vertices[f].y;return[new THREE.UV(a.vertices[d].x,1-a.vertices[d].y),new THREE.UV(b,1-e),new THREE.UV(c,1-f)]},generateBottomUV:function(a,b,c,d,e,f){return this.generateTopUV(a,b,c,d,e,f)},generateSideWallUV:function(a,b,c,d,e,f,g,h){var b=a.vertices[e].x,c=a.vertices[e].y,e=a.vertices[e].z,d=a.vertices[f].x,j=a.vertices[f].y,f=a.vertices[f].z,k=a.vertices[g].x,l=
a.vertices[g].y,g=a.vertices[g].z,o=a.vertices[h].x,m=a.vertices[h].y,a=a.vertices[h].z;return Math.abs(c-j)<0.01?[new THREE.UV(b,e),new THREE.UV(d,f),new THREE.UV(k,g),new THREE.UV(o,a)]:[new THREE.UV(c,e),new THREE.UV(j,f),new THREE.UV(l,g),new THREE.UV(m,a)]}};THREE.ExtrudeGeometry.__v1=new THREE.Vector2;THREE.ExtrudeGeometry.__v2=new THREE.Vector2;THREE.ExtrudeGeometry.__v3=new THREE.Vector2;THREE.ExtrudeGeometry.__v4=new THREE.Vector2;THREE.ExtrudeGeometry.__v5=new THREE.Vector2;
THREE.ExtrudeGeometry.__v6=new THREE.Vector2;
THREE.LatheGeometry=function(a,b,c){THREE.Geometry.call(this);for(var b=b||12,c=c||2*Math.PI,d=[],e=(new THREE.Matrix4).makeRotationZ(c/b),f=0;f<a.length;f++){d[f]=a[f].clone();this.vertices.push(d[f])}for(var g=b+1,c=0;c<g;c++)for(f=0;f<d.length;f++){d[f]=e.multiplyVector3(d[f].clone());this.vertices.push(d[f])}for(c=0;c<b;c++){d=0;for(e=a.length;d<e-1;d++){this.faces.push(new THREE.Face4(c*e+d,(c+1)%g*e+d,(c+1)%g*e+(d+1)%e,c*e+(d+1)%e));this.faceVertexUvs[0].push([new THREE.UV(1-c/b,d/e),new THREE.UV(1-
(c+1)/b,d/e),new THREE.UV(1-(c+1)/b,(d+1)/e),new THREE.UV(1-c/b,(d+1)/e)])}}this.computeCentroids();this.computeFaceNormals();this.computeVertexNormals()};THREE.LatheGeometry.prototype=new THREE.Geometry;THREE.LatheGeometry.prototype.constructor=THREE.LatheGeometry;
THREE.PlaneGeometry=function(a,b,c,d){THREE.Geometry.call(this);for(var e=a/2,f=b/2,c=c||1,d=d||1,g=c+1,h=d+1,j=a/c,k=b/d,l=new THREE.Vector3(0,1,0),a=0;a<h;a++)for(b=0;b<g;b++)this.vertices.push(new THREE.Vector3(b*j-e,0,a*k-f));for(a=0;a<d;a++)for(b=0;b<c;b++){e=new THREE.Face4(b+g*a,b+g*(a+1),b+1+g*(a+1),b+1+g*a);e.normal.copy(l);e.vertexNormals.push(l.clone(),l.clone(),l.clone(),l.clone());this.faces.push(e);this.faceVertexUvs[0].push([new THREE.UV(b/c,a/d),new THREE.UV(b/c,(a+1)/d),new THREE.UV((b+
1)/c,(a+1)/d),new THREE.UV((b+1)/c,a/d)])}this.computeCentroids()};THREE.PlaneGeometry.prototype=new THREE.Geometry;THREE.PlaneGeometry.prototype.constructor=THREE.PlaneGeometry;
THREE.SphereGeometry=function(a,b,c,d,e,f,g){THREE.Geometry.call(this);var a=a||50,d=d!==void 0?d:0,e=e!==void 0?e:Math.PI*2,f=f!==void 0?f:0,g=g!==void 0?g:Math.PI,b=Math.max(3,Math.floor(b)||8),c=Math.max(2,Math.floor(c)||6),h,j,k=[],l=[];for(j=0;j<=c;j++){var o=[],m=[];for(h=0;h<=b;h++){var p=h/b,r=j/c,n=new THREE.Vector3;n.x=-a*Math.cos(d+p*e)*Math.sin(f+r*g);n.y=a*Math.cos(f+r*g);n.z=a*Math.sin(d+p*e)*Math.sin(f+r*g);this.vertices.push(n);o.push(this.vertices.length-1);m.push(new THREE.UV(p,
r))}k.push(o);l.push(m)}for(j=0;j<c;j++)for(h=0;h<b;h++){var d=k[j][h+1],e=k[j][h],f=k[j+1][h],g=k[j+1][h+1],o=this.vertices[d].clone().normalize(),m=this.vertices[e].clone().normalize(),p=this.vertices[f].clone().normalize(),r=this.vertices[g].clone().normalize(),n=l[j][h+1].clone(),q=l[j][h].clone(),u=l[j+1][h].clone(),t=l[j+1][h+1].clone();if(Math.abs(this.vertices[d].y)==a){this.faces.push(new THREE.Face3(d,f,g,[o,p,r]));this.faceVertexUvs[0].push([n,u,t])}else if(Math.abs(this.vertices[f].y)==
a){this.faces.push(new THREE.Face3(d,e,f,[o,m,p]));this.faceVertexUvs[0].push([n,q,u])}else{this.faces.push(new THREE.Face4(d,e,f,g,[o,m,p,r]));this.faceVertexUvs[0].push([n,q,u,t])}}this.computeCentroids();this.computeFaceNormals();this.boundingSphere={radius:a}};THREE.SphereGeometry.prototype=new THREE.Geometry;THREE.SphereGeometry.prototype.constructor=THREE.SphereGeometry;
THREE.TextGeometry=function(a,b){var c=THREE.FontUtils.generateShapes(a,b);b.amount=b.height!==void 0?b.height:50;if(b.bevelThickness===void 0)b.bevelThickness=10;if(b.bevelSize===void 0)b.bevelSize=8;if(b.bevelEnabled===void 0)b.bevelEnabled=false;if(b.bend){var d=c[c.length-1].getBoundingBox().maxX;b.bendPath=new THREE.QuadraticBezierCurve(new THREE.Vector2(0,0),new THREE.Vector2(d/2,120),new THREE.Vector2(d,0))}THREE.ExtrudeGeometry.call(this,c,b)};THREE.TextGeometry.prototype=new THREE.ExtrudeGeometry;
THREE.TextGeometry.prototype.constructor=THREE.TextGeometry;
THREE.TorusGeometry=function(a,b,c,d,e){THREE.Geometry.call(this);this.radius=a||100;this.tube=b||40;this.segmentsR=c||8;this.segmentsT=d||6;this.arc=e||Math.PI*2;e=new THREE.Vector3;a=[];b=[];for(c=0;c<=this.segmentsR;c++)for(d=0;d<=this.segmentsT;d++){var f=d/this.segmentsT*this.arc,g=c/this.segmentsR*Math.PI*2;e.x=this.radius*Math.cos(f);e.y=this.radius*Math.sin(f);var h=new THREE.Vector3;h.x=(this.radius+this.tube*Math.cos(g))*Math.cos(f);h.y=(this.radius+this.tube*Math.cos(g))*Math.sin(f);h.z=
this.tube*Math.sin(g);this.vertices.push(h);a.push(new THREE.UV(d/this.segmentsT,1-c/this.segmentsR));b.push(h.clone().subSelf(e).normalize())}for(c=1;c<=this.segmentsR;c++)for(d=1;d<=this.segmentsT;d++){var e=(this.segmentsT+1)*c+d-1,f=(this.segmentsT+1)*(c-1)+d-1,g=(this.segmentsT+1)*(c-1)+d,h=(this.segmentsT+1)*c+d,j=new THREE.Face4(e,f,g,h,[b[e],b[f],b[g],b[h]]);j.normal.addSelf(b[e]);j.normal.addSelf(b[f]);j.normal.addSelf(b[g]);j.normal.addSelf(b[h]);j.normal.normalize();this.faces.push(j);
this.faceVertexUvs[0].push([a[e].clone(),a[f].clone(),a[g].clone(),a[h].clone()])}this.computeCentroids()};THREE.TorusGeometry.prototype=new THREE.Geometry;THREE.TorusGeometry.prototype.constructor=THREE.TorusGeometry;
THREE.TorusKnotGeometry=function(a,b,c,d,e,f,g){function h(a,b,c,d,e,f){var g=Math.cos(a);Math.cos(b);b=Math.sin(a);a=c/d*a;c=Math.cos(a);g=e*(2+c)*0.5*g;b=e*(2+c)*b*0.5;e=f*e*Math.sin(a)*0.5;return new THREE.Vector3(g,b,e)}THREE.Geometry.call(this);this.radius=a||200;this.tube=b||40;this.segmentsR=c||64;this.segmentsT=d||8;this.p=e||2;this.q=f||3;this.heightScale=g||1;this.grid=Array(this.segmentsR);c=new THREE.Vector3;d=new THREE.Vector3;e=new THREE.Vector3;for(a=0;a<this.segmentsR;++a){this.grid[a]=
Array(this.segmentsT);for(b=0;b<this.segmentsT;++b){var j=a/this.segmentsR*2*this.p*Math.PI,g=b/this.segmentsT*2*Math.PI,f=h(j,g,this.q,this.p,this.radius,this.heightScale),j=h(j+0.01,g,this.q,this.p,this.radius,this.heightScale);c.sub(j,f);d.add(j,f);e.cross(c,d);d.cross(e,c);e.normalize();d.normalize();j=-this.tube*Math.cos(g);g=this.tube*Math.sin(g);f.x=f.x+(j*d.x+g*e.x);f.y=f.y+(j*d.y+g*e.y);f.z=f.z+(j*d.z+g*e.z);this.grid[a][b]=this.vertices.push(new THREE.Vector3(f.x,f.y,f.z))-1}}for(a=0;a<
this.segmentsR;++a)for(b=0;b<this.segmentsT;++b){var e=(a+1)%this.segmentsR,f=(b+1)%this.segmentsT,c=this.grid[a][b],d=this.grid[e][b],e=this.grid[e][f],f=this.grid[a][f],g=new THREE.UV(a/this.segmentsR,b/this.segmentsT),j=new THREE.UV((a+1)/this.segmentsR,b/this.segmentsT),k=new THREE.UV((a+1)/this.segmentsR,(b+1)/this.segmentsT),l=new THREE.UV(a/this.segmentsR,(b+1)/this.segmentsT);this.faces.push(new THREE.Face4(c,d,e,f));this.faceVertexUvs[0].push([g,j,k,l])}this.computeCentroids();this.computeFaceNormals();
this.computeVertexNormals()};THREE.TorusKnotGeometry.prototype=new THREE.Geometry;THREE.TorusKnotGeometry.prototype.constructor=THREE.TorusKnotGeometry;
THREE.TubeGeometry=function(a,b,c,d,e,f){THREE.Geometry.call(this);this.path=a;this.segments=b||64;this.radius=c||1;this.segmentsRadius=d||8;this.closed=e||false;if(f)this.debug=new THREE.Object3D;this.grid=[];var g,h,f=this.segments+1,j,k,l,o=new THREE.Vector3,m,p,r,b=new THREE.TubeGeometry.FrenetFrames(a,b,e);m=b.tangents;p=b.normals;r=b.binormals;this.tangents=m;this.normals=p;this.binormals=r;for(b=0;b<f;b++){this.grid[b]=[];d=b/(f-1);l=a.getPointAt(d);d=m[b];g=p[b];h=r[b];if(this.debug){this.debug.add(new THREE.ArrowHelper(d,
l,c,255));this.debug.add(new THREE.ArrowHelper(g,l,c,16711680));this.debug.add(new THREE.ArrowHelper(h,l,c,65280))}for(d=0;d<this.segmentsRadius;d++){j=d/this.segmentsRadius*2*Math.PI;k=-this.radius*Math.cos(j);j=this.radius*Math.sin(j);o.copy(l);o.x=o.x+(k*g.x+j*h.x);o.y=o.y+(k*g.y+j*h.y);o.z=o.z+(k*g.z+j*h.z);this.grid[b][d]=this.vertices.push(new THREE.Vector3(o.x,o.y,o.z))-1}}for(b=0;b<this.segments;b++)for(d=0;d<this.segmentsRadius;d++){f=e?(b+1)%this.segments:b+1;o=(d+1)%this.segmentsRadius;
a=this.grid[b][d];c=this.grid[f][d];f=this.grid[f][o];o=this.grid[b][o];m=new THREE.UV(b/this.segments,d/this.segmentsRadius);p=new THREE.UV((b+1)/this.segments,d/this.segmentsRadius);r=new THREE.UV((b+1)/this.segments,(d+1)/this.segmentsRadius);g=new THREE.UV(b/this.segments,(d+1)/this.segmentsRadius);this.faces.push(new THREE.Face4(a,c,f,o));this.faceVertexUvs[0].push([m,p,r,g])}this.computeCentroids();this.computeFaceNormals();this.computeVertexNormals()};THREE.TubeGeometry.prototype=new THREE.Geometry;
THREE.TubeGeometry.prototype.constructor=THREE.TubeGeometry;
THREE.TubeGeometry.FrenetFrames=function(a,b,c){new THREE.Vector3;var d=new THREE.Vector3;new THREE.Vector3;var e=[],f=[],g=[],h=new THREE.Vector3,j=new THREE.Matrix4,b=b+1,k,l,o;this.tangents=e;this.normals=f;this.binormals=g;for(k=0;k<b;k++){l=k/(b-1);e[k]=a.getTangentAt(l);e[k].normalize()}f[0]=new THREE.Vector3;g[0]=new THREE.Vector3;a=Number.MAX_VALUE;k=Math.abs(e[0].x);l=Math.abs(e[0].y);o=Math.abs(e[0].z);if(k<=a){a=k;d.set(1,0,0)}if(l<=a){a=l;d.set(0,1,0)}o<=a&&d.set(0,0,1);h.cross(e[0],d).normalize();
f[0].cross(e[0],h);g[0].cross(e[0],f[0]);for(k=1;k<b;k++){f[k]=f[k-1].clone();g[k]=g[k-1].clone();h.cross(e[k-1],e[k]);if(h.length()>1.0E-4){h.normalize();d=Math.acos(e[k-1].dot(e[k]));j.makeRotationAxis(h,d).multiplyVector3(f[k])}g[k].cross(e[k],f[k])}if(c){d=Math.acos(f[0].dot(f[b-1]));d=d/(b-1);e[0].dot(h.cross(f[0],f[b-1]))>0&&(d=-d);for(k=1;k<b;k++){j.makeRotationAxis(e[k],d*k).multiplyVector3(f[k]);g[k].cross(e[k],f[k])}}};
THREE.PolyhedronGeometry=function(a,b,c,d){function e(a){var b=a.normalize().clone();b.index=j.vertices.push(b)-1;var c=Math.atan2(a.z,-a.x)/2/Math.PI+0.5,a=Math.atan2(-a.y,Math.sqrt(a.x*a.x+a.z*a.z))/Math.PI+0.5;b.uv=new THREE.UV(c,a);return b}function f(a,b,c,d){if(d<1){d=new THREE.Face3(a.index,b.index,c.index,[a.clone(),b.clone(),c.clone()]);d.centroid.addSelf(a).addSelf(b).addSelf(c).divideScalar(3);d.normal=d.centroid.clone().normalize();j.faces.push(d);d=Math.atan2(d.centroid.z,-d.centroid.x);
j.faceVertexUvs[0].push([h(a.uv,a,d),h(b.uv,b,d),h(c.uv,c,d)])}else{d=d-1;f(a,g(a,b),g(a,c),d);f(g(a,b),b,g(b,c),d);f(g(a,c),g(b,c),c,d);f(g(a,b),g(b,c),g(a,c),d)}}function g(a,b){o[a.index]||(o[a.index]=[]);o[b.index]||(o[b.index]=[]);var c=o[a.index][b.index];c===void 0&&(o[a.index][b.index]=o[b.index][a.index]=c=e((new THREE.Vector3).add(a,b).divideScalar(2)));return c}function h(a,b,c){c<0&&a.u===1&&(a=new THREE.UV(a.u-1,a.v));b.x===0&&b.z===0&&(a=new THREE.UV(c/2/Math.PI+0.5,a.v));return a}THREE.Geometry.call(this);
for(var c=c||1,d=d||0,j=this,k=0,l=a.length;k<l;k++)e(new THREE.Vector3(a[k][0],a[k][1],a[k][2]));for(var o=[],a=this.vertices,k=0,l=b.length;k<l;k++)f(a[b[k][0]],a[b[k][1]],a[b[k][2]],d);this.mergeVertices();k=0;for(l=this.vertices.length;k<l;k++)this.vertices[k].multiplyScalar(c);this.computeCentroids();this.boundingSphere={radius:c}};THREE.PolyhedronGeometry.prototype=new THREE.Geometry;THREE.PolyhedronGeometry.prototype.constructor=THREE.PolyhedronGeometry;
THREE.IcosahedronGeometry=function(a,b){var c=(1+Math.sqrt(5))/2;THREE.PolyhedronGeometry.call(this,[[-1,c,0],[1,c,0],[-1,-c,0],[1,-c,0],[0,-1,c],[0,1,c],[0,-1,-c],[0,1,-c],[c,0,-1],[c,0,1],[-c,0,-1],[-c,0,1]],[[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]],a,b)};THREE.IcosahedronGeometry.prototype=new THREE.Geometry;THREE.IcosahedronGeometry.prototype.constructor=THREE.IcosahedronGeometry;
THREE.OctahedronGeometry=function(a,b){THREE.PolyhedronGeometry.call(this,[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]],[[0,2,4],[0,4,3],[0,3,5],[0,5,2],[1,2,5],[1,5,3],[1,3,4],[1,4,2]],a,b)};THREE.OctahedronGeometry.prototype=new THREE.Geometry;THREE.OctahedronGeometry.prototype.constructor=THREE.OctahedronGeometry;THREE.TetrahedronGeometry=function(a,b){THREE.PolyhedronGeometry.call(this,[[1,1,1],[-1,-1,1],[-1,1,-1],[1,-1,-1]],[[2,1,0],[0,3,2],[1,3,0],[2,3,1]],a,b)};
THREE.TetrahedronGeometry.prototype=new THREE.Geometry;THREE.TetrahedronGeometry.prototype.constructor=THREE.TetrahedronGeometry;
THREE.ParametricGeometry=function(a,b,c,d){THREE.Geometry.call(this);var e=this.vertices,f=this.faces,g=this.faceVertexUvs[0],d=d===void 0?false:d,h,j,k,l,o=b+1;for(h=0;h<=c;h++){l=h/c;for(j=0;j<=b;j++){k=j/b;k=a(k,l);e.push(k)}}var m,p,r,n;for(h=0;h<c;h++)for(j=0;j<b;j++){a=h*o+j;e=h*o+j+1;l=(h+1)*o+j;k=(h+1)*o+j+1;m=new THREE.UV(j/b,h/c);p=new THREE.UV((j+1)/b,h/c);r=new THREE.UV(j/b,(h+1)/c);n=new THREE.UV((j+1)/b,(h+1)/c);if(d){f.push(new THREE.Face3(a,e,l));f.push(new THREE.Face3(e,k,l));g.push([m,
p,r]);g.push([p,n,r])}else{f.push(new THREE.Face4(a,e,k,l));g.push([m,p,n,r])}}this.computeCentroids();this.computeFaceNormals();this.computeVertexNormals()};THREE.ParametricGeometry.prototype=new THREE.Geometry;THREE.ParametricGeometry.prototype.constructor=THREE.ParametricGeometry;
THREE.ConvexGeometry=function(a){function b(b){var d=a[b].clone(),f=d.length();d.x=d.x+f*c();d.y=d.y+f*c();d.z=d.z+f*c();for(var f=[],g=0;g<e.length;){var h=e[g],j=d,k=a[h[0]],u;u=k;var t=a[h[1]],y=a[h[2]],s=new THREE.Vector3,x=new THREE.Vector3;s.sub(y,t);x.sub(u,t);s.crossSelf(x);s.isZero()||s.normalize();u=s;k=u.dot(k);if(u.dot(j)>=k){for(j=0;j<3;j++){k=[h[j],h[(j+1)%3]];u=true;for(t=0;t<f.length;t++)if(f[t][0]===k[1]&&f[t][1]===k[0]){f[t]=f[f.length-1];f.pop();u=false;break}u&&f.push(k)}e[g]=
e[e.length-1];e.pop()}else g++}for(t=0;t<f.length;t++)e.push([f[t][0],f[t][1],b])}function c(){return(Math.random()-0.5)*2.0E-6}function d(a){var b=a.length();return new THREE.UV(a.x/b,a.y/b)}THREE.Geometry.call(this);for(var e=[[0,1,2],[0,2,1]],f=3;f<a.length;f++)b(f);for(var g=0,h=Array(a.length),f=0;f<e.length;f++)for(var j=e[f],k=0;k<3;k++){if(h[j[k]]===void 0){h[j[k]]=g++;this.vertices.push(a[j[k]])}j[k]=h[j[k]]}for(f=0;f<e.length;f++)this.faces.push(new THREE.Face3(e[f][0],e[f][1],e[f][2]));
for(f=0;f<this.faces.length;f++){j=this.faces[f];this.faceVertexUvs[0].push([d(this.vertices[j.a]),d(this.vertices[j.b]),d(this.vertices[j.c])])}this.computeCentroids();this.computeFaceNormals();this.computeVertexNormals()};THREE.ConvexGeometry.prototype=new THREE.Geometry;THREE.ConvexGeometry.prototype.constructor=THREE.ConvexGeometry;
THREE.AxisHelper=function(){THREE.Object3D.call(this);var a=new THREE.Geometry;a.vertices.push(new THREE.Vector3);a.vertices.push(new THREE.Vector3(0,100,0));var b=new THREE.CylinderGeometry(0,5,25,5,1),c;c=new THREE.Line(a,new THREE.LineBasicMaterial({color:16711680}));c.rotation.z=-Math.PI/2;this.add(c);c=new THREE.Mesh(b,new THREE.MeshBasicMaterial({color:16711680}));c.position.x=100;c.rotation.z=-Math.PI/2;this.add(c);c=new THREE.Line(a,new THREE.LineBasicMaterial({color:65280}));this.add(c);
c=new THREE.Mesh(b,new THREE.MeshBasicMaterial({color:65280}));c.position.y=100;this.add(c);c=new THREE.Line(a,new THREE.LineBasicMaterial({color:255}));c.rotation.x=Math.PI/2;this.add(c);c=new THREE.Mesh(b,new THREE.MeshBasicMaterial({color:255}));c.position.z=100;c.rotation.x=Math.PI/2;this.add(c)};THREE.AxisHelper.prototype=new THREE.Object3D;THREE.AxisHelper.prototype.constructor=THREE.AxisHelper;
THREE.ArrowHelper=function(a,b,c,d){THREE.Object3D.call(this);d===void 0&&(d=16776960);c===void 0&&(c=20);var e=new THREE.Geometry;e.vertices.push(new THREE.Vector3(0,0,0));e.vertices.push(new THREE.Vector3(0,1,0));this.line=new THREE.Line(e,new THREE.LineBasicMaterial({color:d}));this.add(this.line);e=new THREE.CylinderGeometry(0,0.05,0.25,5,1);this.cone=new THREE.Mesh(e,new THREE.MeshBasicMaterial({color:d}));this.cone.position.set(0,1,0);this.add(this.cone);if(b instanceof THREE.Vector3)this.position=
b;this.setDirection(a);this.setLength(c)};THREE.ArrowHelper.prototype=new THREE.Object3D;THREE.ArrowHelper.prototype.constructor=THREE.ArrowHelper;THREE.ArrowHelper.prototype.setDirection=function(a){var b=(new THREE.Vector3(0,1,0)).crossSelf(a),a=Math.acos((new THREE.Vector3(0,1,0)).dot(a.clone().normalize()));this.matrix=(new THREE.Matrix4).makeRotationAxis(b.normalize(),a);this.rotation.getRotationFromMatrix(this.matrix,this.scale)};
THREE.ArrowHelper.prototype.setLength=function(a){this.scale.set(a,a,a)};THREE.ArrowHelper.prototype.setColor=function(a){this.line.material.color.setHex(a);this.cone.material.color.setHex(a)};
THREE.CameraHelper=function(a){function b(a,b,d){c(a,d);c(b,d)}function c(a,b){d.lineGeometry.vertices.push(new THREE.Vector3);d.lineGeometry.colors.push(new THREE.Color(b));d.pointMap[a]===void 0&&(d.pointMap[a]=[]);d.pointMap[a].push(d.lineGeometry.vertices.length-1)}THREE.Object3D.call(this);var d=this;this.lineGeometry=new THREE.Geometry;this.lineMaterial=new THREE.LineBasicMaterial({color:16777215,vertexColors:THREE.FaceColors});this.pointMap={};b("n1","n2",16755200);b("n2","n4",16755200);b("n4",
"n3",16755200);b("n3","n1",16755200);b("f1","f2",16755200);b("f2","f4",16755200);b("f4","f3",16755200);b("f3","f1",16755200);b("n1","f1",16755200);b("n2","f2",16755200);b("n3","f3",16755200);b("n4","f4",16755200);b("p","n1",16711680);b("p","n2",16711680);b("p","n3",16711680);b("p","n4",16711680);b("u1","u2",43775);b("u2","u3",43775);b("u3","u1",43775);b("c","t",16777215);b("p","c",3355443);b("cn1","cn2",3355443);b("cn3","cn4",3355443);b("cf1","cf2",3355443);b("cf3","cf4",3355443);this.camera=a;this.update(a);
this.lines=new THREE.Line(this.lineGeometry,this.lineMaterial,THREE.LinePieces);this.add(this.lines)};THREE.CameraHelper.prototype=new THREE.Object3D;THREE.CameraHelper.prototype.constructor=THREE.CameraHelper;
THREE.CameraHelper.prototype.update=function(){function a(a,d,e,f){THREE.CameraHelper.__v.set(d,e,f);THREE.CameraHelper.__projector.unprojectVector(THREE.CameraHelper.__v,THREE.CameraHelper.__c);a=b.pointMap[a];if(a!==void 0){d=0;for(e=a.length;d<e;d++)b.lineGeometry.vertices[a[d]].copy(THREE.CameraHelper.__v)}}var b=this;THREE.CameraHelper.__c.projectionMatrix.copy(this.camera.projectionMatrix);a("c",0,0,-1);a("t",0,0,1);a("n1",-1,-1,-1);a("n2",1,-1,-1);a("n3",-1,1,-1);a("n4",1,1,-1);a("f1",-1,-1,
1);a("f2",1,-1,1);a("f3",-1,1,1);a("f4",1,1,1);a("u1",0.7,1.1,-1);a("u2",-0.7,1.1,-1);a("u3",0,2,-1);a("cf1",-1,0,1);a("cf2",1,0,1);a("cf3",0,-1,1);a("cf4",0,1,1);a("cn1",-1,0,-1);a("cn2",1,0,-1);a("cn3",0,-1,-1);a("cn4",0,1,-1);this.lineGeometry.verticesNeedUpdate=true};THREE.CameraHelper.__projector=new THREE.Projector;THREE.CameraHelper.__v=new THREE.Vector3;THREE.CameraHelper.__c=new THREE.Camera;
THREE.SubdivisionModifier=function(a){this.subdivisions=a===void 0?1:a;this.useOldVertexColors=false;this.supportUVs=true;this.debug=false};THREE.SubdivisionModifier.prototype.constructor=THREE.SubdivisionModifier;THREE.SubdivisionModifier.prototype.modify=function(a){for(var b=this.subdivisions;b-- >0;)this.smooth(a)};
THREE.SubdivisionModifier.prototype.smooth=function(a){function b(){m.debug&&console.log.apply(console,arguments)}function c(){console&&console.log.apply(console,arguments)}function d(a,c,d,e,g,h,i){var j=new THREE.Face4(a,c,d,e,null,g.color,g.materialIndex);if(m.useOldVertexColors){j.vertexColors=[];for(var k,n,p,q=0;q<4;q++){p=h[q];k=new THREE.Color;k.setRGB(0,0,0);for(var r=0;r<p.length;r++){n=g.vertexColors[p[r]-1];k.r=k.r+n.r;k.g=k.g+n.g;k.b=k.b+n.b}k.r=k.r/p.length;k.g=k.g/p.length;k.b=k.b/
p.length;j.vertexColors[q]=k}}l.push(j);if(m.supportUVs){g=[f(a,""),f(c,i),f(d,i),f(e,i)];g[0]?g[1]?g[2]?g[3]?o.push(g):b("d :( ",e+":"+i):b("c :( ",d+":"+i):b("b :( ",c+":"+i):b("a :( ",a+":"+i)}}function e(a,b){return Math.min(a,b)+"_"+Math.max(a,b)}function f(a,d){var e=a+":"+d,f=t[e];if(!f){a>=y&&a<y+r.length?b("face pt"):b("edge pt");c("warning, UV not found for",e);return null}return f}function g(a,b,d){var e=a+":"+b;e in t?c("dup vertexNo",a,"oldFaceNo",b,"value",d,"key",e,t[e]):t[e]=d}function h(a,
b){R[a]===void 0&&(R[a]=[]);R[a].push(b)}function j(a,b,c){Z[a]===void 0&&(Z[a]={});Z[a][b]=c}var k=[],l=[],o=[],m=this,p=a.vertices,r=a.faces,k=p.concat(),n=[],q={},u={},t={},y=p.length,s,x,E,D,A,v=a.faceVertexUvs[0],H;b("originalFaces, uvs, originalVerticesLength",r.length,v.length,y);if(m.supportUVs){s=0;for(x=v.length;s<x;s++){E=0;for(D=v[s].length;E<D;E++){H=r[s]["abcd".charAt(E)];g(H,s,v[s][E])}}}if(v.length==0)m.supportUVs=false;s=0;for(A in t)s++;if(!s){m.supportUVs=false;b("no uvs")}b("-- Original Faces + Vertices UVs completed",
t,"vs",v.length);s=0;for(x=r.length;s<x;s++){A=r[s];n.push(A.centroid);k.push(A.centroid);if(m.supportUVs){v=new THREE.UV;if(A instanceof THREE.Face3){v.u=f(A.a,s).u+f(A.b,s).u+f(A.c,s).u;v.v=f(A.a,s).v+f(A.b,s).v+f(A.c,s).v;v.u=v.u/3;v.v=v.v/3}else if(A instanceof THREE.Face4){v.u=f(A.a,s).u+f(A.b,s).u+f(A.c,s).u+f(A.d,s).u;v.v=f(A.a,s).v+f(A.b,s).v+f(A.c,s).v+f(A.d,s).v;v.u=v.u/4;v.v=v.v/4}g(y+s,"",v)}}b("-- added UVs for new Faces",t);x=function(a){function b(a,c){h[a]===void 0&&(h[a]=[]);h[a].push(c)}
var c,d,f,g,h={};c=0;for(d=a.faces.length;c<d;c++){f=a.faces[c];if(f instanceof THREE.Face3){g=e(f.a,f.b);b(g,c);g=e(f.b,f.c);b(g,c);g=e(f.c,f.a);b(g,c)}else if(f instanceof THREE.Face4){g=e(f.a,f.b);b(g,c);g=e(f.b,f.c);b(g,c);g=e(f.c,f.d);b(g,c);g=e(f.d,f.a);b(g,c)}}return h}(a);H=0;var I,M,R={},Z={};for(s in x){v=x[s];I=s.split("_");M=I[0];I=I[1];h(M,[M,I]);h(I,[M,I]);E=0;for(D=v.length;E<D;E++){A=v[E];j(M,A,s);j(I,A,s)}v.length<2&&(u[s]=true)}b("vertexEdgeMap",R,"vertexFaceMap",Z);for(s in x){v=
x[s];A=v[0];D=v[1];I=s.split("_");M=I[0];I=I[1];v=new THREE.Vector3;if(u[s]){v.addSelf(p[M]);v.addSelf(p[I]);v.multiplyScalar(0.5)}else{v.addSelf(n[A]);v.addSelf(n[D]);v.addSelf(p[M]);v.addSelf(p[I]);v.multiplyScalar(0.25)}q[s]=y+r.length+H;k.push(v);H++;if(m.supportUVs){v=new THREE.UV;v.u=f(M,A).u+f(I,A).u;v.v=f(M,A).v+f(I,A).v;v.u=v.u/2;v.v=v.v/2;g(q[s],A,v);if(!u[s]){v=new THREE.UV;v.u=f(M,D).u+f(I,D).u;v.v=f(M,D).v+f(I,D).v;v.u=v.u/2;v.v=v.v/2;g(q[s],D,v)}}}b("-- Step 2 done");var B,G;D=["123",
"12","2","23"];I=["123","23","3","31"];var Q=["123","31","1","12"],C=["1234","12","2","23"],i=["1234","23","3","34"],P=["1234","34","4","41"],L=["1234","41","1","12"];s=0;for(x=n.length;s<x;s++){A=r[s];v=y+s;if(A instanceof THREE.Face3){H=e(A.a,A.b);M=e(A.b,A.c);B=e(A.c,A.a);d(v,q[H],A.b,q[M],A,D,s);d(v,q[M],A.c,q[B],A,I,s);d(v,q[B],A.a,q[H],A,Q,s)}else if(A instanceof THREE.Face4){H=e(A.a,A.b);M=e(A.b,A.c);B=e(A.c,A.d);G=e(A.d,A.a);d(v,q[H],A.b,q[M],A,C,s);d(v,q[M],A.c,q[B],A,i,s);d(v,q[B],A.d,q[G],
A,P,s);d(v,q[G],A.a,q[H],A,L,s)}else b("face should be a face!",A)}q=new THREE.Vector3;A=new THREE.Vector3;s=0;for(x=p.length;s<x;s++)if(R[s]!==void 0){q.set(0,0,0);A.set(0,0,0);M=new THREE.Vector3(0,0,0);v=0;for(E in Z[s]){q.addSelf(n[E]);v++}D=0;H=R[s].length;for(E=0;E<H;E++)u[e(R[s][E][0],R[s][E][1])]&&D++;if(D!=2){q.divideScalar(v);for(E=0;E<H;E++){v=R[s][E];v=p[v[0]].clone().addSelf(p[v[1]]).divideScalar(2);A.addSelf(v)}A.divideScalar(H);M.addSelf(p[s]);M.multiplyScalar(H-3);M.addSelf(q);M.addSelf(A.multiplyScalar(2));
M.divideScalar(H);k[s]=M}}a.vertices=k;a.faces=l;a.faceVertexUvs[0]=o;delete a.__tmpVertices;a.computeCentroids();a.computeFaceNormals();a.computeVertexNormals()};THREE.ImmediateRenderObject=function(){THREE.Object3D.call(this);this.render=function(){}};THREE.ImmediateRenderObject.prototype=new THREE.Object3D;THREE.ImmediateRenderObject.prototype.constructor=THREE.ImmediateRenderObject;
THREE.LensFlare=function(a,b,c,d,e){THREE.Object3D.call(this);this.lensFlares=[];this.positionScreen=new THREE.Vector3;this.customUpdateCallback=void 0;a!==void 0&&this.add(a,b,c,d,e)};THREE.LensFlare.prototype=new THREE.Object3D;THREE.LensFlare.prototype.constructor=THREE.LensFlare;
THREE.LensFlare.prototype.add=function(a,b,c,d,e,f){b===void 0&&(b=-1);c===void 0&&(c=0);f===void 0&&(f=1);e===void 0&&(e=new THREE.Color(16777215));if(d===void 0)d=THREE.NormalBlending;c=Math.min(c,Math.max(0,c));this.lensFlares.push({texture:a,size:b,distance:c,x:0,y:0,z:0,scale:1,rotation:1,opacity:f,color:e,blending:d})};
THREE.LensFlare.prototype.updateLensFlares=function(){var a,b=this.lensFlares.length,c,d=-this.positionScreen.x*2,e=-this.positionScreen.y*2;for(a=0;a<b;a++){c=this.lensFlares[a];c.x=this.positionScreen.x+d*c.distance;c.y=this.positionScreen.y+e*c.distance;c.wantedRotation=c.x*Math.PI*0.25;c.rotation=c.rotation+(c.wantedRotation-c.rotation)*0.25}};
THREE.MorphBlendMesh=function(a,b){THREE.Mesh.call(this,a,b);this.animationsMap={};this.animationsList=[];var c=this.geometry.morphTargets.length;this.createAnimation("__default",0,c-1,c/1);this.setAnimationWeight("__default",1)};THREE.MorphBlendMesh.prototype=new THREE.Mesh;THREE.MorphBlendMesh.prototype.constructor=THREE.MorphBlendMesh;
THREE.MorphBlendMesh.prototype.createAnimation=function(a,b,c,d){b={startFrame:b,endFrame:c,length:c-b+1,fps:d,duration:(c-b)/d,lastFrame:0,currentFrame:0,active:false,time:0,direction:1,weight:1,directionBackwards:false,mirroredLoop:false};this.animationsMap[a]=b;this.animationsList.push(b)};
THREE.MorphBlendMesh.prototype.autoCreateAnimations=function(a){for(var b=/([a-z]+)(\d+)/,c,d={},e=this.geometry,f=0,g=e.morphTargets.length;f<g;f++){var h=e.morphTargets[f].name.match(b);if(h&&h.length>1){var j=h[1];d[j]||(d[j]={start:Infinity,end:-Infinity});h=d[j];if(f<h.start)h.start=f;if(f>h.end)h.end=f;c||(c=j)}}for(j in d){h=d[j];this.createAnimation(j,h.start,h.end,a)}this.firstAnimation=c};
THREE.MorphBlendMesh.prototype.setAnimationDirectionForward=function(a){if(a=this.animationsMap[a]){a.direction=1;a.directionBackwards=false}};THREE.MorphBlendMesh.prototype.setAnimationDirectionBackward=function(a){if(a=this.animationsMap[a]){a.direction=-1;a.directionBackwards=true}};THREE.MorphBlendMesh.prototype.setAnimationFPS=function(a,b){var c=this.animationsMap[a];if(c){c.fps=b;c.duration=(c.end-c.start)/c.fps}};
THREE.MorphBlendMesh.prototype.setAnimationDuration=function(a,b){var c=this.animationsMap[a];if(c){c.duration=b;c.fps=(c.end-c.start)/c.duration}};THREE.MorphBlendMesh.prototype.setAnimationWeight=function(a,b){var c=this.animationsMap[a];if(c)c.weight=b};THREE.MorphBlendMesh.prototype.setAnimationTime=function(a,b){var c=this.animationsMap[a];if(c)c.time=b};THREE.MorphBlendMesh.prototype.getAnimationTime=function(a){var b=0;if(a=this.animationsMap[a])b=a.time;return b};
THREE.MorphBlendMesh.prototype.getAnimationDuration=function(a){var b=-1;if(a=this.animationsMap[a])b=a.duration;return b};THREE.MorphBlendMesh.prototype.playAnimation=function(a){var b=this.animationsMap[a];if(b){b.time=0;b.active=true}else console.warn("animation["+a+"] undefined")};THREE.MorphBlendMesh.prototype.stopAnimation=function(a){if(a=this.animationsMap[a])a.active=false};
THREE.MorphBlendMesh.prototype.update=function(a){for(var b=0,c=this.animationsList.length;b<c;b++){var d=this.animationsList[b];if(d.active){var e=d.duration/d.length;d.time=d.time+d.direction*a;if(d.mirroredLoop){if(d.time>d.duration||d.time<0){d.direction=d.direction*-1;if(d.time>d.duration){d.time=d.duration;d.directionBackwards=true}if(d.time<0){d.time=0;d.directionBackwards=false}}}else{d.time=d.time%d.duration;if(d.time<0)d.time=d.time+d.duration}var f=d.startFrame+THREE.Math.clamp(Math.floor(d.time/
e),0,d.length-1),g=d.weight;if(f!==d.currentFrame){this.morphTargetInfluences[d.lastFrame]=0;this.morphTargetInfluences[d.currentFrame]=1*g;this.morphTargetInfluences[f]=0;d.lastFrame=d.currentFrame;d.currentFrame=f}e=d.time%e/e;d.directionBackwards&&(e=1-e);this.morphTargetInfluences[d.currentFrame]=e*g;this.morphTargetInfluences[d.lastFrame]=(1-e)*g}}};
THREE.LensFlarePlugin=function(){function a(a){var c=b.createProgram(),d=b.createShader(b.FRAGMENT_SHADER),e=b.createShader(b.VERTEX_SHADER);b.shaderSource(d,a.fragmentShader);b.shaderSource(e,a.vertexShader);b.compileShader(d);b.compileShader(e);b.attachShader(c,d);b.attachShader(c,e);b.linkProgram(c);return c}var b,c,d,e,f,g,h,j,k,l,o,m,p;this.init=function(r){b=r.context;c=r;d=new Float32Array(16);e=new Uint16Array(6);r=0;d[r++]=-1;d[r++]=-1;d[r++]=0;d[r++]=0;d[r++]=1;d[r++]=-1;d[r++]=1;d[r++]=
0;d[r++]=1;d[r++]=1;d[r++]=1;d[r++]=1;d[r++]=-1;d[r++]=1;d[r++]=0;d[r++]=1;r=0;e[r++]=0;e[r++]=1;e[r++]=2;e[r++]=0;e[r++]=2;e[r++]=3;f=b.createBuffer();g=b.createBuffer();b.bindBuffer(b.ARRAY_BUFFER,f);b.bufferData(b.ARRAY_BUFFER,d,b.STATIC_DRAW);b.bindBuffer(b.ELEMENT_ARRAY_BUFFER,g);b.bufferData(b.ELEMENT_ARRAY_BUFFER,e,b.STATIC_DRAW);h=b.createTexture();j=b.createTexture();b.bindTexture(b.TEXTURE_2D,h);b.texImage2D(b.TEXTURE_2D,0,b.RGB,16,16,0,b.RGB,b.UNSIGNED_BYTE,null);b.texParameteri(b.TEXTURE_2D,
b.TEXTURE_WRAP_S,b.CLAMP_TO_EDGE);b.texParameteri(b.TEXTURE_2D,b.TEXTURE_WRAP_T,b.CLAMP_TO_EDGE);b.texParameteri(b.TEXTURE_2D,b.TEXTURE_MAG_FILTER,b.NEAREST);b.texParameteri(b.TEXTURE_2D,b.TEXTURE_MIN_FILTER,b.NEAREST);b.bindTexture(b.TEXTURE_2D,j);b.texImage2D(b.TEXTURE_2D,0,b.RGBA,16,16,0,b.RGBA,b.UNSIGNED_BYTE,null);b.texParameteri(b.TEXTURE_2D,b.TEXTURE_WRAP_S,b.CLAMP_TO_EDGE);b.texParameteri(b.TEXTURE_2D,b.TEXTURE_WRAP_T,b.CLAMP_TO_EDGE);b.texParameteri(b.TEXTURE_2D,b.TEXTURE_MAG_FILTER,b.NEAREST);
b.texParameteri(b.TEXTURE_2D,b.TEXTURE_MIN_FILTER,b.NEAREST);if(b.getParameter(b.MAX_VERTEX_TEXTURE_IMAGE_UNITS)<=0){k=false;l=a(THREE.ShaderFlares.lensFlare)}else{k=true;l=a(THREE.ShaderFlares.lensFlareVertexTexture)}o={};m={};o.vertex=b.getAttribLocation(l,"position");o.uv=b.getAttribLocation(l,"uv");m.renderType=b.getUniformLocation(l,"renderType");m.map=b.getUniformLocation(l,"map");m.occlusionMap=b.getUniformLocation(l,"occlusionMap");m.opacity=b.getUniformLocation(l,"opacity");m.color=b.getUniformLocation(l,
"color");m.scale=b.getUniformLocation(l,"scale");m.rotation=b.getUniformLocation(l,"rotation");m.screenPosition=b.getUniformLocation(l,"screenPosition");p=false};this.render=function(a,d,e,u){var a=a.__webglFlares,t=a.length;if(t){var y=new THREE.Vector3,s=u/e,x=e*0.5,E=u*0.5,D=16/u,A=new THREE.Vector2(D*s,D),v=new THREE.Vector3(1,1,0),H=new THREE.Vector2(1,1),I=m,D=o;b.useProgram(l);if(!p){b.enableVertexAttribArray(o.vertex);b.enableVertexAttribArray(o.uv);p=true}b.uniform1i(I.occlusionMap,0);b.uniform1i(I.map,
1);b.bindBuffer(b.ARRAY_BUFFER,f);b.vertexAttribPointer(D.vertex,2,b.FLOAT,false,16,0);b.vertexAttribPointer(D.uv,2,b.FLOAT,false,16,8);b.bindBuffer(b.ELEMENT_ARRAY_BUFFER,g);b.disable(b.CULL_FACE);b.depthMask(false);var M,R,Z,B,G;for(M=0;M<t;M++){D=16/u;A.set(D*s,D);B=a[M];y.set(B.matrixWorld.elements[12],B.matrixWorld.elements[13],B.matrixWorld.elements[14]);d.matrixWorldInverse.multiplyVector3(y);d.projectionMatrix.multiplyVector3(y);v.copy(y);H.x=v.x*x+x;H.y=v.y*E+E;if(k||H.x>0&&H.x<e&&H.y>0&&
H.y<u){b.activeTexture(b.TEXTURE1);b.bindTexture(b.TEXTURE_2D,h);b.copyTexImage2D(b.TEXTURE_2D,0,b.RGB,H.x-8,H.y-8,16,16,0);b.uniform1i(I.renderType,0);b.uniform2f(I.scale,A.x,A.y);b.uniform3f(I.screenPosition,v.x,v.y,v.z);b.disable(b.BLEND);b.enable(b.DEPTH_TEST);b.drawElements(b.TRIANGLES,6,b.UNSIGNED_SHORT,0);b.activeTexture(b.TEXTURE0);b.bindTexture(b.TEXTURE_2D,j);b.copyTexImage2D(b.TEXTURE_2D,0,b.RGBA,H.x-8,H.y-8,16,16,0);b.uniform1i(I.renderType,1);b.disable(b.DEPTH_TEST);b.activeTexture(b.TEXTURE1);
b.bindTexture(b.TEXTURE_2D,h);b.drawElements(b.TRIANGLES,6,b.UNSIGNED_SHORT,0);B.positionScreen.copy(v);B.customUpdateCallback?B.customUpdateCallback(B):B.updateLensFlares();b.uniform1i(I.renderType,2);b.enable(b.BLEND);R=0;for(Z=B.lensFlares.length;R<Z;R++){G=B.lensFlares[R];if(G.opacity>0.001&&G.scale>0.001){v.x=G.x;v.y=G.y;v.z=G.z;D=G.size*G.scale/u;A.x=D*s;A.y=D;b.uniform3f(I.screenPosition,v.x,v.y,v.z);b.uniform2f(I.scale,A.x,A.y);b.uniform1f(I.rotation,G.rotation);b.uniform1f(I.opacity,G.opacity);
b.uniform3f(I.color,G.color.r,G.color.g,G.color.b);c.setBlending(G.blending,G.blendEquation,G.blendSrc,G.blendDst);c.setTexture(G.texture,1);b.drawElements(b.TRIANGLES,6,b.UNSIGNED_SHORT,0)}}}}b.enable(b.CULL_FACE);b.enable(b.DEPTH_TEST);b.depthMask(true)}}};
THREE.ShadowMapPlugin=function(){var a,b,c,d,e=new THREE.Frustum,f=new THREE.Matrix4,g=new THREE.Vector3,h=new THREE.Vector3;this.init=function(e){a=e.context;b=e;var e=THREE.ShaderLib.depthRGBA,f=THREE.UniformsUtils.clone(e.uniforms);c=new THREE.ShaderMaterial({fragmentShader:e.fragmentShader,vertexShader:e.vertexShader,uniforms:f});d=new THREE.ShaderMaterial({fragmentShader:e.fragmentShader,vertexShader:e.vertexShader,uniforms:f,morphTargets:true});c._shadowPass=true;d._shadowPass=true};this.render=
function(a,c){b.shadowMapEnabled&&b.shadowMapAutoUpdate&&this.update(a,c)};this.update=function(j,k){var l,o,m,p,r,n,q,u,t,y=[];p=0;a.clearColor(1,1,1,1);a.disable(a.BLEND);a.enable(a.CULL_FACE);b.shadowMapCullFrontFaces?a.cullFace(a.FRONT):a.cullFace(a.BACK);b.setDepthTest(true);l=0;for(o=j.__lights.length;l<o;l++){m=j.__lights[l];if(m.castShadow)if(m instanceof THREE.DirectionalLight&&m.shadowCascade)for(r=0;r<m.shadowCascadeCount;r++){var s;if(m.shadowCascadeArray[r])s=m.shadowCascadeArray[r];
else{t=m;q=r;s=new THREE.DirectionalLight;s.isVirtual=true;s.onlyShadow=true;s.castShadow=true;s.shadowCameraNear=t.shadowCameraNear;s.shadowCameraFar=t.shadowCameraFar;s.shadowCameraLeft=t.shadowCameraLeft;s.shadowCameraRight=t.shadowCameraRight;s.shadowCameraBottom=t.shadowCameraBottom;s.shadowCameraTop=t.shadowCameraTop;s.shadowCameraVisible=t.shadowCameraVisible;s.shadowDarkness=t.shadowDarkness;s.shadowBias=t.shadowCascadeBias[q];s.shadowMapWidth=t.shadowCascadeWidth[q];s.shadowMapHeight=t.shadowCascadeHeight[q];
s.pointsWorld=[];s.pointsFrustum=[];u=s.pointsWorld;n=s.pointsFrustum;for(var x=0;x<8;x++){u[x]=new THREE.Vector3;n[x]=new THREE.Vector3}u=t.shadowCascadeNearZ[q];t=t.shadowCascadeFarZ[q];n[0].set(-1,-1,u);n[1].set(1,-1,u);n[2].set(-1,1,u);n[3].set(1,1,u);n[4].set(-1,-1,t);n[5].set(1,-1,t);n[6].set(-1,1,t);n[7].set(1,1,t);s.originalCamera=k;n=new THREE.Gyroscope;n.position=m.shadowCascadeOffset;n.add(s);n.add(s.target);k.add(n);m.shadowCascadeArray[r]=s;console.log("Created virtualLight",s)}q=m;u=
r;t=q.shadowCascadeArray[u];t.position.copy(q.position);t.target.position.copy(q.target.position);t.lookAt(t.target);t.shadowCameraVisible=q.shadowCameraVisible;t.shadowDarkness=q.shadowDarkness;t.shadowBias=q.shadowCascadeBias[u];n=q.shadowCascadeNearZ[u];q=q.shadowCascadeFarZ[u];t=t.pointsFrustum;t[0].z=n;t[1].z=n;t[2].z=n;t[3].z=n;t[4].z=q;t[5].z=q;t[6].z=q;t[7].z=q;y[p]=s;p++}else{y[p]=m;p++}}l=0;for(o=y.length;l<o;l++){m=y[l];if(!m.shadowMap){m.shadowMap=new THREE.WebGLRenderTarget(m.shadowMapWidth,
m.shadowMapHeight,{minFilter:THREE.LinearFilter,magFilter:THREE.LinearFilter,format:THREE.RGBAFormat});m.shadowMapSize=new THREE.Vector2(m.shadowMapWidth,m.shadowMapHeight);m.shadowMatrix=new THREE.Matrix4}if(!m.shadowCamera){if(m instanceof THREE.SpotLight)m.shadowCamera=new THREE.PerspectiveCamera(m.shadowCameraFov,m.shadowMapWidth/m.shadowMapHeight,m.shadowCameraNear,m.shadowCameraFar);else if(m instanceof THREE.DirectionalLight)m.shadowCamera=new THREE.OrthographicCamera(m.shadowCameraLeft,m.shadowCameraRight,
m.shadowCameraTop,m.shadowCameraBottom,m.shadowCameraNear,m.shadowCameraFar);else{console.error("Unsupported light type for shadow");continue}j.add(m.shadowCamera);b.autoUpdateScene&&j.updateMatrixWorld()}if(m.shadowCameraVisible&&!m.cameraHelper){m.cameraHelper=new THREE.CameraHelper(m.shadowCamera);m.shadowCamera.add(m.cameraHelper)}if(m.isVirtual&&s.originalCamera==k){r=k;p=m.shadowCamera;n=m.pointsFrustum;t=m.pointsWorld;g.set(Infinity,Infinity,Infinity);h.set(-Infinity,-Infinity,-Infinity);for(q=
0;q<8;q++){u=t[q];u.copy(n[q]);THREE.ShadowMapPlugin.__projector.unprojectVector(u,r);p.matrixWorldInverse.multiplyVector3(u);if(u.x<g.x)g.x=u.x;if(u.x>h.x)h.x=u.x;if(u.y<g.y)g.y=u.y;if(u.y>h.y)h.y=u.y;if(u.z<g.z)g.z=u.z;if(u.z>h.z)h.z=u.z}p.left=g.x;p.right=h.x;p.top=h.y;p.bottom=g.y;p.updateProjectionMatrix()}p=m.shadowMap;n=m.shadowMatrix;r=m.shadowCamera;r.position.copy(m.matrixWorld.getPosition());r.lookAt(m.target.matrixWorld.getPosition());r.updateMatrixWorld();r.matrixWorldInverse.getInverse(r.matrixWorld);
if(m.cameraHelper)m.cameraHelper.lines.visible=m.shadowCameraVisible;m.shadowCameraVisible&&m.cameraHelper.update();n.set(0.5,0,0,0.5,0,0.5,0,0.5,0,0,0.5,0.5,0,0,0,1);n.multiplySelf(r.projectionMatrix);n.multiplySelf(r.matrixWorldInverse);if(!r._viewMatrixArray)r._viewMatrixArray=new Float32Array(16);if(!r._projectionMatrixArray)r._projectionMatrixArray=new Float32Array(16);r.matrixWorldInverse.flattenToArray(r._viewMatrixArray);r.projectionMatrix.flattenToArray(r._projectionMatrixArray);f.multiply(r.projectionMatrix,
r.matrixWorldInverse);e.setFromMatrix(f);b.setRenderTarget(p);b.clear();t=j.__webglObjects;m=0;for(p=t.length;m<p;m++){q=t[m];n=q.object;q.render=false;if(n.visible&&n.castShadow&&(!(n instanceof THREE.Mesh)||!n.frustumCulled||e.contains(n))){n._modelViewMatrix.multiply(r.matrixWorldInverse,n.matrixWorld);q.render=true}}m=0;for(p=t.length;m<p;m++){q=t[m];if(q.render){n=q.object;q=q.buffer;u=n.customDepthMaterial?n.customDepthMaterial:n.geometry.morphTargets.length?d:c;q instanceof THREE.BufferGeometry?
b.renderBufferDirect(r,j.__lights,null,u,q,n):b.renderBuffer(r,j.__lights,null,u,q,n)}}t=j.__webglObjectsImmediate;m=0;for(p=t.length;m<p;m++){q=t[m];n=q.object;if(n.visible&&n.castShadow){n._modelViewMatrix.multiply(r.matrixWorldInverse,n.matrixWorld);b.renderImmediateObject(r,j.__lights,null,c,n)}}}l=b.getClearColor();o=b.getClearAlpha();a.clearColor(l.r,l.g,l.b,o);a.enable(a.BLEND);b.shadowMapCullFrontFaces&&a.cullFace(a.BACK)}};THREE.ShadowMapPlugin.__projector=new THREE.Projector;
THREE.SpritePlugin=function(){function a(a,b){return b.z-a.z}var b,c,d,e,f,g,h,j,k,l;this.init=function(a){b=a.context;c=a;d=new Float32Array(16);e=new Uint16Array(6);a=0;d[a++]=-1;d[a++]=-1;d[a++]=0;d[a++]=1;d[a++]=1;d[a++]=-1;d[a++]=1;d[a++]=1;d[a++]=1;d[a++]=1;d[a++]=1;d[a++]=0;d[a++]=-1;d[a++]=1;d[a++]=0;a=d[a++]=0;e[a++]=0;e[a++]=1;e[a++]=2;e[a++]=0;e[a++]=2;e[a++]=3;f=b.createBuffer();g=b.createBuffer();b.bindBuffer(b.ARRAY_BUFFER,f);b.bufferData(b.ARRAY_BUFFER,d,b.STATIC_DRAW);b.bindBuffer(b.ELEMENT_ARRAY_BUFFER,
g);b.bufferData(b.ELEMENT_ARRAY_BUFFER,e,b.STATIC_DRAW);var a=THREE.ShaderSprite.sprite,m=b.createProgram(),p=b.createShader(b.FRAGMENT_SHADER),r=b.createShader(b.VERTEX_SHADER);b.shaderSource(p,a.fragmentShader);b.shaderSource(r,a.vertexShader);b.compileShader(p);b.compileShader(r);b.attachShader(m,p);b.attachShader(m,r);b.linkProgram(m);h=m;j={};k={};j.position=b.getAttribLocation(h,"position");j.uv=b.getAttribLocation(h,"uv");k.uvOffset=b.getUniformLocation(h,"uvOffset");k.uvScale=b.getUniformLocation(h,
"uvScale");k.rotation=b.getUniformLocation(h,"rotation");k.scale=b.getUniformLocation(h,"scale");k.alignment=b.getUniformLocation(h,"alignment");k.color=b.getUniformLocation(h,"color");k.map=b.getUniformLocation(h,"map");k.opacity=b.getUniformLocation(h,"opacity");k.useScreenCoordinates=b.getUniformLocation(h,"useScreenCoordinates");k.affectedByDistance=b.getUniformLocation(h,"affectedByDistance");k.screenPosition=b.getUniformLocation(h,"screenPosition");k.modelViewMatrix=b.getUniformLocation(h,"modelViewMatrix");
k.projectionMatrix=b.getUniformLocation(h,"projectionMatrix");l=false};this.render=function(d,e,p,r){var d=d.__webglSprites,n=d.length;if(n){var q=j,u=k,t=r/p,p=p*0.5,y=r*0.5,s=true;b.useProgram(h);if(!l){b.enableVertexAttribArray(q.position);b.enableVertexAttribArray(q.uv);l=true}b.disable(b.CULL_FACE);b.enable(b.BLEND);b.depthMask(true);b.bindBuffer(b.ARRAY_BUFFER,f);b.vertexAttribPointer(q.position,2,b.FLOAT,false,16,0);b.vertexAttribPointer(q.uv,2,b.FLOAT,false,16,8);b.bindBuffer(b.ELEMENT_ARRAY_BUFFER,
g);b.uniformMatrix4fv(u.projectionMatrix,false,e._projectionMatrixArray);b.activeTexture(b.TEXTURE0);b.uniform1i(u.map,0);for(var x,E=[],q=0;q<n;q++){x=d[q];if(x.visible&&x.opacity!==0)if(x.useScreenCoordinates)x.z=-x.position.z;else{x._modelViewMatrix.multiply(e.matrixWorldInverse,x.matrixWorld);x.z=-x._modelViewMatrix.elements[14]}}d.sort(a);for(q=0;q<n;q++){x=d[q];if(x.visible&&x.opacity!==0&&x.map&&x.map.image&&x.map.image.width){if(x.useScreenCoordinates){b.uniform1i(u.useScreenCoordinates,1);
b.uniform3f(u.screenPosition,(x.position.x-p)/p,(y-x.position.y)/y,Math.max(0,Math.min(1,x.position.z)))}else{b.uniform1i(u.useScreenCoordinates,0);b.uniform1i(u.affectedByDistance,x.affectedByDistance?1:0);b.uniformMatrix4fv(u.modelViewMatrix,false,x._modelViewMatrix.elements)}e=x.map.image.width/(x.scaleByViewport?r:1);E[0]=e*t*x.scale.x;E[1]=e*x.scale.y;b.uniform2f(u.uvScale,x.uvScale.x,x.uvScale.y);b.uniform2f(u.uvOffset,x.uvOffset.x,x.uvOffset.y);b.uniform2f(u.alignment,x.alignment.x,x.alignment.y);
b.uniform1f(u.opacity,x.opacity);b.uniform3f(u.color,x.color.r,x.color.g,x.color.b);b.uniform1f(u.rotation,x.rotation);b.uniform2fv(u.scale,E);if(x.mergeWith3D&&!s){b.enable(b.DEPTH_TEST);s=true}else if(!x.mergeWith3D&&s){b.disable(b.DEPTH_TEST);s=false}c.setBlending(x.blending,x.blendEquation,x.blendSrc,x.blendDst);c.setTexture(x.map,0);b.drawElements(b.TRIANGLES,6,b.UNSIGNED_SHORT,0)}}b.enable(b.CULL_FACE);b.enable(b.DEPTH_TEST);b.depthMask(true)}}};
THREE.DepthPassPlugin=function(){this.enabled=false;this.renderTarget=null;var a,b,c,d,e=new THREE.Frustum,f=new THREE.Matrix4;this.init=function(e){a=e.context;b=e;var e=THREE.ShaderLib.depthRGBA,f=THREE.UniformsUtils.clone(e.uniforms);c=new THREE.ShaderMaterial({fragmentShader:e.fragmentShader,vertexShader:e.vertexShader,uniforms:f});d=new THREE.ShaderMaterial({fragmentShader:e.fragmentShader,vertexShader:e.vertexShader,uniforms:f,morphTargets:true});c._shadowPass=true;d._shadowPass=true};this.render=
function(a,b){this.enabled&&this.update(a,b)};this.update=function(g,h){var j,k,l,o,m,p;a.clearColor(1,1,1,1);a.disable(a.BLEND);b.setDepthTest(true);b.autoUpdateScene&&g.updateMatrixWorld();if(!h._viewMatrixArray)h._viewMatrixArray=new Float32Array(16);if(!h._projectionMatrixArray)h._projectionMatrixArray=new Float32Array(16);h.matrixWorldInverse.getInverse(h.matrixWorld);h.matrixWorldInverse.flattenToArray(h._viewMatrixArray);h.projectionMatrix.flattenToArray(h._projectionMatrixArray);f.multiply(h.projectionMatrix,
h.matrixWorldInverse);e.setFromMatrix(f);b.setRenderTarget(this.renderTarget);b.clear();p=g.__webglObjects;j=0;for(k=p.length;j<k;j++){l=p[j];m=l.object;l.render=false;if(m.visible&&(!(m instanceof THREE.Mesh)||!m.frustumCulled||e.contains(m))){m._modelViewMatrix.multiply(h.matrixWorldInverse,m.matrixWorld);l.render=true}}j=0;for(k=p.length;j<k;j++){l=p[j];if(l.render){m=l.object;l=l.buffer;b.setObjectFaces(m);o=m.customDepthMaterial?m.customDepthMaterial:m.geometry.morphTargets.length?d:c;l instanceof
THREE.BufferGeometry?b.renderBufferDirect(h,g.__lights,null,o,l,m):b.renderBuffer(h,g.__lights,null,o,l,m)}}p=g.__webglObjectsImmediate;j=0;for(k=p.length;j<k;j++){l=p[j];m=l.object;if(m.visible&&m.castShadow){m._modelViewMatrix.multiply(h.matrixWorldInverse,m.matrixWorld);b.renderImmediateObject(h,g.__lights,null,c,m)}}j=b.getClearColor();k=b.getClearAlpha();a.clearColor(j.r,j.g,j.b,k);a.enable(a.BLEND)}};
THREE.ShaderFlares={lensFlareVertexTexture:{vertexShader:"uniform vec3 screenPosition;\nuniform vec2 scale;\nuniform float rotation;\nuniform int renderType;\nuniform sampler2D occlusionMap;\nattribute vec2 position;\nattribute vec2 uv;\nvarying vec2 vUV;\nvarying float vVisibility;\nvoid main() {\nvUV = uv;\nvec2 pos = position;\nif( renderType == 2 ) {\nvec4 visibility = texture2D( occlusionMap, vec2( 0.1, 0.1 ) ) +\ntexture2D( occlusionMap, vec2( 0.5, 0.1 ) ) +\ntexture2D( occlusionMap, vec2( 0.9, 0.1 ) ) +\ntexture2D( occlusionMap, vec2( 0.9, 0.5 ) ) +\ntexture2D( occlusionMap, vec2( 0.9, 0.9 ) ) +\ntexture2D( occlusionMap, vec2( 0.5, 0.9 ) ) +\ntexture2D( occlusionMap, vec2( 0.1, 0.9 ) ) +\ntexture2D( occlusionMap, vec2( 0.1, 0.5 ) ) +\ntexture2D( occlusionMap, vec2( 0.5, 0.5 ) );\nvVisibility = (       visibility.r / 9.0 ) *\n( 1.0 - visibility.g / 9.0 ) *\n(       visibility.b / 9.0 ) *\n( 1.0 - visibility.a / 9.0 );\npos.x = cos( rotation ) * position.x - sin( rotation ) * position.y;\npos.y = sin( rotation ) * position.x + cos( rotation ) * position.y;\n}\ngl_Position = vec4( ( pos * scale + screenPosition.xy ).xy, screenPosition.z, 1.0 );\n}",fragmentShader:"precision mediump float;\nuniform sampler2D map;\nuniform float opacity;\nuniform int renderType;\nuniform vec3 color;\nvarying vec2 vUV;\nvarying float vVisibility;\nvoid main() {\nif( renderType == 0 ) {\ngl_FragColor = vec4( 1.0, 0.0, 1.0, 0.0 );\n} else if( renderType == 1 ) {\ngl_FragColor = texture2D( map, vUV );\n} else {\nvec4 texture = texture2D( map, vUV );\ntexture.a *= opacity * vVisibility;\ngl_FragColor = texture;\ngl_FragColor.rgb *= color;\n}\n}"},
lensFlare:{vertexShader:"uniform vec3 screenPosition;\nuniform vec2 scale;\nuniform float rotation;\nuniform int renderType;\nattribute vec2 position;\nattribute vec2 uv;\nvarying vec2 vUV;\nvoid main() {\nvUV = uv;\nvec2 pos = position;\nif( renderType == 2 ) {\npos.x = cos( rotation ) * position.x - sin( rotation ) * position.y;\npos.y = sin( rotation ) * position.x + cos( rotation ) * position.y;\n}\ngl_Position = vec4( ( pos * scale + screenPosition.xy ).xy, screenPosition.z, 1.0 );\n}",fragmentShader:"precision mediump float;\nuniform sampler2D map;\nuniform sampler2D occlusionMap;\nuniform float opacity;\nuniform int renderType;\nuniform vec3 color;\nvarying vec2 vUV;\nvoid main() {\nif( renderType == 0 ) {\ngl_FragColor = vec4( texture2D( map, vUV ).rgb, 0.0 );\n} else if( renderType == 1 ) {\ngl_FragColor = texture2D( map, vUV );\n} else {\nfloat visibility = texture2D( occlusionMap, vec2( 0.5, 0.1 ) ).a +\ntexture2D( occlusionMap, vec2( 0.9, 0.5 ) ).a +\ntexture2D( occlusionMap, vec2( 0.5, 0.9 ) ).a +\ntexture2D( occlusionMap, vec2( 0.1, 0.5 ) ).a;\nvisibility = ( 1.0 - visibility / 4.0 );\nvec4 texture = texture2D( map, vUV );\ntexture.a *= opacity * visibility;\ngl_FragColor = texture;\ngl_FragColor.rgb *= color;\n}\n}"}};
THREE.ShaderSprite={sprite:{vertexShader:"uniform int useScreenCoordinates;\nuniform int affectedByDistance;\nuniform vec3 screenPosition;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform float rotation;\nuniform vec2 scale;\nuniform vec2 alignment;\nuniform vec2 uvOffset;\nuniform vec2 uvScale;\nattribute vec2 position;\nattribute vec2 uv;\nvarying vec2 vUV;\nvoid main() {\nvUV = uvOffset + uv * uvScale;\nvec2 alignedPosition = position + alignment;\nvec2 rotatedPosition;\nrotatedPosition.x = ( cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y ) * scale.x;\nrotatedPosition.y = ( sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y ) * scale.y;\nvec4 finalPosition;\nif( useScreenCoordinates != 0 ) {\nfinalPosition = vec4( screenPosition.xy + rotatedPosition, screenPosition.z, 1.0 );\n} else {\nfinalPosition = projectionMatrix * modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );\nfinalPosition.xy += rotatedPosition * ( affectedByDistance == 1 ? 1.0 : finalPosition.z );\n}\ngl_Position = finalPosition;\n}",
fragmentShader:"precision mediump float;\nuniform vec3 color;\nuniform sampler2D map;\nuniform float opacity;\nvarying vec2 vUV;\nvoid main() {\nvec4 texture = texture2D( map, vUV );\ngl_FragColor = vec4( color * texture.xyz, texture.a * opacity );\n}"}};
(function(a){StateMachine={VERSION:"2.1.0",Result:{SUCCEEDED:1,NOTRANSITION:2,CANCELLED:3,ASYNC:4},Error:{INVALID_TRANSITION:100,PENDING_TRANSITION:200,INVALID_CALLBACK:300},WILDCARD:"*",ASYNC:"async",create:function(f,g){var i=(typeof f.initial=="string")?{state:f.initial}:f.initial;var e=g||f.target||{};var k=f.events||[];var h=f.callbacks||{};var c={};var j=function(l){var o=(l.from instanceof Array)?l.from:(l.from?[l.from]:[StateMachine.WILDCARD]);c[l.name]=c[l.name]||{};for(var m=0;m<o.length;m++){c[l.name][o[m]]=l.to||o[m]}};if(i){i.event=i.event||"startup";j({name:i.event,from:"none",to:i.state})}for(var d=0;d<k.length;d++){j(k[d])}for(var b in c){if(c.hasOwnProperty(b)){e[b]=StateMachine.buildEvent(b,c[b])}}for(var b in h){if(h.hasOwnProperty(b)){e[b]=h[b]}}e.current="none";e.is=function(l){return this.current==l};e.can=function(l){return !this.transition&&(c[l].hasOwnProperty(this.current)||c[l].hasOwnProperty(StateMachine.WILDCARD))};e.cannot=function(l){return !this.can(l)};e.error=f.error||function(n,r,q,m,l,p,o){throw o||p};if(i&&!i.defer){e[i.event]()}return e},doCallback:function(g,d,c,i,h,b){if(d){try{return d.apply(g,[c,i,h].concat(b))}catch(f){return g.error(c,i,h,b,StateMachine.Error.INVALID_CALLBACK,"an exception occurred in a caller-provided callback function",f)}}},beforeEvent:function(d,c,f,e,b){return StateMachine.doCallback(d,d["onbefore"+c],c,f,e,b)},afterEvent:function(d,c,f,e,b){return StateMachine.doCallback(d,d["onafter"+c]||d["on"+c],c,f,e,b)},leaveState:function(d,c,f,e,b){return StateMachine.doCallback(d,d["onleave"+f],c,f,e,b)},enterState:function(d,c,f,e,b){return StateMachine.doCallback(d,d["onenter"+e]||d["on"+e],c,f,e,b)},changeState:function(d,c,f,e,b){return StateMachine.doCallback(d,d.onchangestate,c,f,e,b)},buildEvent:function(b,c){return function(){var h=this.current;var g=c[h]||c[StateMachine.WILDCARD]||h;var e=Array.prototype.slice.call(arguments);if(this.transition){return this.error(b,h,g,e,StateMachine.Error.PENDING_TRANSITION,"event "+b+" inappropriate because previous transition did not complete")}if(this.cannot(b)){return this.error(b,h,g,e,StateMachine.Error.INVALID_TRANSITION,"event "+b+" inappropriate in current state "+this.current)}if(false===StateMachine.beforeEvent(this,b,h,g,e)){return StateMachine.CANCELLED}if(h===g){StateMachine.afterEvent(this,b,h,g,e);return StateMachine.NOTRANSITION}var f=this;this.transition=function(){f.transition=null;f.current=g;StateMachine.enterState(f,b,h,g,e);StateMachine.changeState(f,b,h,g,e);StateMachine.afterEvent(f,b,h,g,e)};var d=StateMachine.leaveState(this,b,h,g,e);if(false===d){this.transition=null;return StateMachine.CANCELLED}else{if("async"===d){return StateMachine.ASYNC}else{if(this.transition){this.transition()}return StateMachine.SUCCEEDED}}}}};if("function"===typeof define){define([],function(){return StateMachine})}else{a.StateMachine=StateMachine}}(this));//fgnass.github.com/spin.js#v1.2.5
(function(a,b,c){function g(a,c){var d=b.createElement(a||"div"),e;for(e in c)d[e]=c[e];return d}function h(a){for(var b=1,c=arguments.length;b<c;b++)a.appendChild(arguments[b]);return a}function j(a,b,c,d){var g=["opacity",b,~~(a*100),c,d].join("-"),h=.01+c/d*100,j=Math.max(1-(1-a)/b*(100-h),a),k=f.substring(0,f.indexOf("Animation")).toLowerCase(),l=k&&"-"+k+"-"||"";return e[g]||(i.insertRule("@"+l+"keyframes "+g+"{"+"0%{opacity:"+j+"}"+h+"%{opacity:"+a+"}"+(h+.01)+"%{opacity:1}"+(h+b)%100+"%{opacity:"+a+"}"+"100%{opacity:"+j+"}"+"}",0),e[g]=1),g}function k(a,b){var e=a.style,f,g;if(e[b]!==c)return b;b=b.charAt(0).toUpperCase()+b.slice(1);for(g=0;g<d.length;g++){f=d[g]+b;if(e[f]!==c)return f}}function l(a,b){for(var c in b)a.style[k(a,c)||c]=b[c];return a}function m(a){for(var b=1;b<arguments.length;b++){var d=arguments[b];for(var e in d)a[e]===c&&(a[e]=d[e])}return a}function n(a){var b={x:a.offsetLeft,y:a.offsetTop};while(a=a.offsetParent)b.x+=a.offsetLeft,b.y+=a.offsetTop;return b}var d=["webkit","Moz","ms","O"],e={},f,i=function(){var a=g("style");return h(b.getElementsByTagName("head")[0],a),a.sheet||a.styleSheet}(),o={lines:12,length:7,width:5,radius:10,rotate:0,color:"#000",speed:1,trail:100,opacity:.25,fps:20,zIndex:2e9,className:"spinner",top:"auto",left:"auto"},p=function q(a){if(!this.spin)return new q(a);this.opts=m(a||{},q.defaults,o)};p.defaults={},m(p.prototype,{spin:function(a){this.stop();var b=this,c=b.opts,d=b.el=l(g(0,{className:c.className}),{position:"relative",zIndex:c.zIndex}),e=c.radius+c.length+c.width,h,i;a&&(a.insertBefore(d,a.firstChild||null),i=n(a),h=n(d),l(d,{left:(c.left=="auto"?i.x-h.x+(a.offsetWidth>>1):c.left+e)+"px",top:(c.top=="auto"?i.y-h.y+(a.offsetHeight>>1):c.top+e)+"px"})),d.setAttribute("aria-role","progressbar"),b.lines(d,b.opts);if(!f){var j=0,k=c.fps,m=k/c.speed,o=(1-c.opacity)/(m*c.trail/100),p=m/c.lines;!function q(){j++;for(var a=c.lines;a;a--){var e=Math.max(1-(j+a*p)%m*o,c.opacity);b.opacity(d,c.lines-a,e,c)}b.timeout=b.el&&setTimeout(q,~~(1e3/k))}()}return b},stop:function(){var a=this.el;return a&&(clearTimeout(this.timeout),a.parentNode&&a.parentNode.removeChild(a),this.el=c),this},lines:function(a,b){function e(a,d){return l(g(),{position:"absolute",width:b.length+b.width+"px",height:b.width+"px",background:a,boxShadow:d,transformOrigin:"left",transform:"rotate("+~~(360/b.lines*c+b.rotate)+"deg) translate("+b.radius+"px"+",0)",borderRadius:(b.width>>1)+"px"})}var c=0,d;for(;c<b.lines;c++)d=l(g(),{position:"absolute",top:1+~(b.width/2)+"px",transform:b.hwaccel?"translate3d(0,0,0)":"",opacity:b.opacity,animation:f&&j(b.opacity,b.trail,c,b.lines)+" "+1/b.speed+"s linear infinite"}),b.shadow&&h(d,l(e("#000","0 0 4px #000"),{top:"2px"})),h(a,h(d,e(b.color,"0 0 1px rgba(0,0,0,.1)")));return a},opacity:function(a,b,c){b<a.childNodes.length&&(a.childNodes[b].style.opacity=c)}}),!function(){function a(a,b){return g("<"+a+' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">',b)}var b=l(g("group"),{behavior:"url(#default#VML)"});!k(b,"transform")&&b.adj?(i.addRule(".spin-vml","behavior:url(#default#VML)"),p.prototype.lines=function(b,c){function f(){return l(a("group",{coordsize:e+" "+e,coordorigin:-d+" "+ -d}),{width:e,height:e})}function k(b,e,g){h(i,h(l(f(),{rotation:360/c.lines*b+"deg",left:~~e}),h(l(a("roundrect",{arcsize:1}),{width:d,height:c.width,left:c.radius,top:-c.width>>1,filter:g}),a("fill",{color:c.color,opacity:c.opacity}),a("stroke",{opacity:0}))))}var d=c.length+c.width,e=2*d,g=-(c.width+c.length)*2+"px",i=l(f(),{position:"absolute",top:g,left:g}),j;if(c.shadow)for(j=1;j<=c.lines;j++)k(j,-2,"progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)");for(j=1;j<=c.lines;j++)k(j);return h(b,i)},p.prototype.opacity=function(a,b,c,d){var e=a.firstChild;d=d.shadow&&d.lines||0,e&&b+d<e.childNodes.length&&(e=e.childNodes[b+d],e=e&&e.firstChild,e=e&&e.firstChild,e&&(e.opacity=c))}):f=k(b,"animation")}(),a.Spinner=p})(window,document);/*global setTimeout: false, console: false */(function(){var a={},b=this,c=b.async;typeof module!="undefined"&&module.exports?module.exports=a:b.async=a,a.noConflict=function(){return b.async=c,a};var d=function(a,b){if(a.forEach)return a.forEach(b);for(var c=0;c<a.length;c+=1)b(a[c],c,a)},e=function(a,b){if(a.map)return a.map(b);var c=[];return d(a,function(a,d,e){c.push(b(a,d,e))}),c},f=function(a,b,c){return a.reduce?a.reduce(b,c):(d(a,function(a,d,e){c=b(c,a,d,e)}),c)},g=function(a){if(Object.keys)return Object.keys(a);var b=[];for(var c in a)a.hasOwnProperty(c)&&b.push(c);return b};typeof process=="undefined"||!process.nextTick?a.nextTick=function(a){setTimeout(a,0)}:a.nextTick=process.nextTick,a.forEach=function(a,b,c){c=c||function(){};if(!a.length)return c();var e=0;d(a,function(d){b(d,function(b){b?(c(b),c=function(){}):(e+=1,e===a.length&&c())})})},a.forEachSeries=function(a,b,c){c=c||function(){};if(!a.length)return c();var d=0,e=function(){b(a[d],function(b){b?(c(b),c=function(){}):(d+=1,d===a.length?c():e())})};e()},a.forEachLimit=function(a,b,c,d){d=d||function(){};if(!a.length||b<=0)return d();var e=0,f=0,g=0;(function h(){if(e===a.length)return d();while(g<b&&f<a.length)c(a[f],function(b){b?(d(b),d=function(){}):(e+=1,g-=1,e===a.length?d():h())}),f+=1,g+=1})()};var h=function(b){return function(){var c=Array.prototype.slice.call(arguments);return b.apply(null,[a.forEach].concat(c))}},i=function(b){return function(){var c=Array.prototype.slice.call(arguments);return b.apply(null,[a.forEachSeries].concat(c))}},j=function(a,b,c,d){var f=[];b=e(b,function(a,b){return{index:b,value:a}}),a(b,function(a,b){c(a.value,function(c,d){f[a.index]=d,b(c)})},function(a){d(a,f)})};a.map=h(j),a.mapSeries=i(j),a.reduce=function(b,c,d,e){a.forEachSeries(b,function(a,b){d(c,a,function(a,d){c=d,b(a)})},function(a){e(a,c)})},a.inject=a.reduce,a.foldl=a.reduce,a.reduceRight=function(b,c,d,f){var g=e(b,function(a){return a}).reverse();a.reduce(g,c,d,f)},a.foldr=a.reduceRight;var k=function(a,b,c,d){var f=[];b=e(b,function(a,b){return{index:b,value:a}}),a(b,function(a,b){c(a.value,function(c){c&&f.push(a),b()})},function(a){d(e(f.sort(function(a,b){return a.index-b.index}),function(a){return a.value}))})};a.filter=h(k),a.filterSeries=i(k),a.select=a.filter,a.selectSeries=a.filterSeries;var l=function(a,b,c,d){var f=[];b=e(b,function(a,b){return{index:b,value:a}}),a(b,function(a,b){c(a.value,function(c){c||f.push(a),b()})},function(a){d(e(f.sort(function(a,b){return a.index-b.index}),function(a){return a.value}))})};a.reject=h(l),a.rejectSeries=i(l);var m=function(a,b,c,d){a(b,function(a,b){c(a,function(c){c?(d(a),d=function(){}):b()})},function(a){d()})};a.detect=h(m),a.detectSeries=i(m),a.some=function(b,c,d){a.forEach(b,function(a,b){c(a,function(a){a&&(d(!0),d=function(){}),b()})},function(a){d(!1)})},a.any=a.some,a.every=function(b,c,d){a.forEach(b,function(a,b){c(a,function(a){a||(d(!1),d=function(){}),b()})},function(a){d(!0)})},a.all=a.every,a.sortBy=function(b,c,d){a.map(b,function(a,b){c(a,function(c,d){c?b(c):b(null,{value:a,criteria:d})})},function(a,b){if(a)return d(a);var c=function(a,b){var c=a.criteria,d=b.criteria;return c<d?-1:c>d?1:0};d(null,e(b.sort(c),function(a){return a.value}))})},a.auto=function(a,b){b=b||function(){};var c=g(a);if(!c.length)return b(null);var e={},h=[],i=function(a){h.unshift(a)},j=function(a){for(var b=0;b<h.length;b+=1)if(h[b]===a){h.splice(b,1);return}},k=function(){d(h.slice(0),function(a){a()})};i(function(){g(e).length===c.length&&(b(null,e),b=function(){})}),d(c,function(c){var d=a[c]instanceof Function?[a[c]]:a[c],g=function(a){if(a)b(a),b=function(){};else{var d=Array.prototype.slice.call(arguments,1);d.length<=1&&(d=d[0]),e[c]=d,k()}},h=d.slice(0,Math.abs(d.length-1))||[],l=function(){return f(h,function(a,b){return a&&e.hasOwnProperty(b)},!0)};if(l())d[d.length-1](g,e);else{var m=function(){l()&&(j(m),d[d.length-1](g,e))};i(m)}})},a.waterfall=function(b,c){c=c||function(){};if(!b.length)return c();var d=function(b){return function(e){if(e)c(e),c=function(){};else{var f=Array.prototype.slice.call(arguments,1),g=b.next();g?f.push(d(g)):f.push(c),a.nextTick(function(){b.apply(null,f)})}}};d(a.iterator(b))()},a.parallel=function(b,c){c=c||function(){};if(b.constructor===Array)a.map(b,function(a,b){a&&a(function(a){var c=Array.prototype.slice.call(arguments,1);c.length<=1&&(c=c[0]),b.call(null,a,c)})},c);else{var d={};a.forEach(g(b),function(a,c){b[a](function(b){var e=Array.prototype.slice.call(arguments,1);e.length<=1&&(e=e[0]),d[a]=e,c(b)})},function(a){c(a,d)})}},a.series=function(b,c){c=c||function(){};if(b.constructor===Array)a.mapSeries(b,function(a,b){a&&a(function(a){var c=Array.prototype.slice.call(arguments,1);c.length<=1&&(c=c[0]),b.call(null,a,c)})},c);else{var d={};a.forEachSeries(g(b),function(a,c){b[a](function(b){var e=Array.prototype.slice.call(arguments,1);e.length<=1&&(e=e[0]),d[a]=e,c(b)})},function(a){c(a,d)})}},a.iterator=function(a){var b=function(c){var d=function(){return a.length&&a[c].apply(null,arguments),d.next()};return d.next=function(){return c<a.length-1?b(c+1):null},d};return b(0)},a.apply=function(a){var b=Array.prototype.slice.call(arguments,1);return function(){return a.apply(null,b.concat(Array.prototype.slice.call(arguments)))}};var n=function(a,b,c,d){var e=[];a(b,function(a,b){c(a,function(a,c){e=e.concat(c||[]),b(a)})},function(a){d(a,e)})};a.concat=h(n),a.concatSeries=i(n),a.whilst=function(b,c,d){b()?c(function(e){if(e)return d(e);a.whilst(b,c,d)}):d()},a.until=function(b,c,d){b()?d():c(function(e){if(e)return d(e);a.until(b,c,d)})},a.queue=function(b,c){var e=0,f={tasks:[],concurrency:c,saturated:null,empty:null,drain:null,push:function(b,e){b.constructor!==Array&&(b=[b]),d(b,function(b){f.tasks.push({data:b,callback:typeof e=="function"?e:null}),f.saturated&&f.tasks.length==c&&f.saturated(),a.nextTick(f.process)})},process:function(){if(e<f.concurrency&&f.tasks.length){var a=f.tasks.shift();f.empty&&f.tasks.length==0&&f.empty(),e+=1,b(a.data,function(){e-=1,a.callback&&a.callback.apply(a,arguments),f.drain&&f.tasks.length+e==0&&f.drain(),f.process()})}},length:function(){return f.tasks.length},running:function(){return e}};return f};var o=function(a){return function(b){var c=Array.prototype.slice.call(arguments,1);b.apply(null,c.concat([function(b){var c=Array.prototype.slice.call(arguments,1);typeof console!="undefined"&&(b?console.error&&console.error(b):console[a]&&d(c,function(b){console[a](b)}))}]))}};a.log=o("log"),a.dir=o("dir"),a.memoize=function(a,b){var c={},d={};b=b||function(a){return a};var e=function(){var e=Array.prototype.slice.call(arguments),f=e.pop(),g=b.apply(null,e);g in c?f.apply(null,c[g]):g in d?d[g].push(f):(d[g]=[f],a.apply(null,e.concat([function(){c[g]=arguments;var a=d[g];delete d[g];for(var b=0,e=a.length;b<e;b++)a[b].apply(null,arguments)}])))};return e.unmemoized=a,e},a.unmemoize=function(a){return function(){return(a.unmemoized||a).apply(null,arguments)}}})();// Generated by CoffeeScript 1.5.0
(function() {
  var PianoKey, PianoKeyboard, PianoKeyboardDesign,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  PianoKeyboardDesign = (function() {

    PianoKeyboardDesign.prototype.KeyType = {
      WhiteC: 0,
      WhiteD: 1,
      WhiteE: 2,
      WhiteF: 3,
      WhiteG: 4,
      WhiteA: 5,
      WhiteB: 6,
      Black: 7
    };

    PianoKeyboardDesign.prototype.whiteKeyStep = 0.236;

    PianoKeyboardDesign.prototype.whiteKeyWidth = 0.226;

    PianoKeyboardDesign.prototype.whiteKeyHeight = 0.22;

    PianoKeyboardDesign.prototype.whiteKeyLength = 1.50;

    PianoKeyboardDesign.prototype.blackKeyWidth = 0.10;

    PianoKeyboardDesign.prototype.blackKeyHeight = 0.24;

    PianoKeyboardDesign.prototype.blackKeyLength = 1.00;

    PianoKeyboardDesign.prototype.blackKeyShiftCDE = 0.0216;

    PianoKeyboardDesign.prototype.blackKeyShiftFGAB = 0.0340;

    PianoKeyboardDesign.prototype.blackKeyPosY = 0.10;

    PianoKeyboardDesign.prototype.blackKeyPosZ = -0.24;

    PianoKeyboardDesign.prototype.noteDropPosZ4WhiteKey = 0.25;

    PianoKeyboardDesign.prototype.noteDropPosZ4BlackKey = 0.75;

    PianoKeyboardDesign.prototype.whiteKeyColor = 0xffffff;

    PianoKeyboardDesign.prototype.blackKeyColor = 0x111111;

    PianoKeyboardDesign.prototype.keyDip = 0.08;

    PianoKeyboardDesign.prototype.keyUpSpeed = 0.03;

    PianoKeyboardDesign.prototype.keyInfo = [];

    PianoKeyboardDesign.prototype.noteToColor = (function() {
      var map, offset;
      map = MusicTheory.Synesthesia.map('August Aeppli (1940)');
      offset = MIDI.pianoKeyOffset;
      return function(note) {
        if (map[note - offset] == null) {
          return 0x000000;
        }
        return parseInt(map[note - offset].hex, 16);
      };
    })();

    function PianoKeyboardDesign() {
      var i, _i;
      for (i = _i = 0; _i < 128; i = ++_i) {
        this.keyInfo[i] = {};
      }
      this._initKeyType();
      this._initKeyPos();
    }

    PianoKeyboardDesign.prototype._initKeyType = function() {
      var Black, KeyType, WhiteA, WhiteB, WhiteC, WhiteD, WhiteE, WhiteF, WhiteG, i, keyInfo, noteNo, _i;
      keyInfo = this.keyInfo, KeyType = this.KeyType;
      WhiteC = KeyType.WhiteC, WhiteD = KeyType.WhiteD, WhiteE = KeyType.WhiteE, WhiteF = KeyType.WhiteF, WhiteG = KeyType.WhiteG, WhiteA = KeyType.WhiteA, WhiteB = KeyType.WhiteB, Black = KeyType.Black;
      for (i = _i = 0; _i < 10; i = ++_i) {
        noteNo = i * 12;
        keyInfo[noteNo + 0].keyType = WhiteC;
        keyInfo[noteNo + 1].keyType = Black;
        keyInfo[noteNo + 2].keyType = WhiteD;
        keyInfo[noteNo + 3].keyType = Black;
        keyInfo[noteNo + 4].keyType = WhiteE;
        keyInfo[noteNo + 5].keyType = WhiteF;
        keyInfo[noteNo + 6].keyType = Black;
        keyInfo[noteNo + 7].keyType = WhiteG;
        keyInfo[noteNo + 8].keyType = Black;
        keyInfo[noteNo + 9].keyType = WhiteA;
        keyInfo[noteNo + 10].keyType = Black;
        keyInfo[noteNo + 11].keyType = WhiteB;
      }
      noteNo = 120;
      keyInfo[noteNo + 0].keyType = WhiteC;
      keyInfo[noteNo + 1].keyType = Black;
      keyInfo[noteNo + 2].keyType = WhiteD;
      keyInfo[noteNo + 3].keyType = Black;
      keyInfo[noteNo + 4].keyType = WhiteE;
      keyInfo[noteNo + 5].keyType = WhiteF;
      keyInfo[noteNo + 6].keyType = Black;
      return keyInfo[noteNo + 7].keyType = WhiteB;
    };

    PianoKeyboardDesign.prototype._initKeyPos = function() {
      var Black, KeyType, WhiteA, WhiteB, WhiteC, WhiteD, WhiteE, WhiteF, WhiteG, blackKeyShiftCDE, blackKeyShiftFGAB, keyInfo, noteNo, posX, prevKeyType, shift, whiteKeyStep, _i, _j, _results;
      KeyType = this.KeyType, keyInfo = this.keyInfo, whiteKeyStep = this.whiteKeyStep, blackKeyShiftCDE = this.blackKeyShiftCDE, blackKeyShiftFGAB = this.blackKeyShiftFGAB;
      WhiteC = KeyType.WhiteC, WhiteD = KeyType.WhiteD, WhiteE = KeyType.WhiteE, WhiteF = KeyType.WhiteF, WhiteG = KeyType.WhiteG, WhiteA = KeyType.WhiteA, WhiteB = KeyType.WhiteB, Black = KeyType.Black;
      noteNo = 0;
      prevKeyType = WhiteB;
      posX = 0.0;
      shift = 0.0;
      keyInfo[noteNo].keyCenterPosX = posX;
      prevKeyType = keyInfo[noteNo].keyType;
      for (noteNo = _i = 1; _i < 128; noteNo = ++_i) {
        if (prevKeyType === Black) {
          if (keyInfo[noteNo].keyType === Black) {

          } else {
            posX += whiteKeyStep / 2.0;
          }
        } else {
          if (keyInfo[noteNo].keyType === Black) {
            posX += whiteKeyStep / 2.0;
          } else {
            posX += whiteKeyStep;
          }
        }
        keyInfo[noteNo].keyCenterPosX = posX;
        prevKeyType = keyInfo[noteNo].keyType;
      }
      prevKeyType = WhiteC;
      _results = [];
      for (noteNo = _j = 0; _j < 128; noteNo = ++_j) {
        if (keyInfo[noteNo].keyType === Black) {
          switch (prevKeyType) {
            case WhiteC:
              shift = -blackKeyShiftCDE;
              break;
            case WhiteD:
              shift = +blackKeyShiftCDE;
              break;
            case WhiteF:
              shift = -blackKeyShiftFGAB;
              break;
            case WhiteG:
              shift = 0.0;
              break;
            case WhiteA:
              shift = +blackKeyShiftFGAB;
              break;
            default:
              shift = 0.0;
          }
          if (noteNo === 126) {
            shift = 0.0;
          }
          keyInfo[noteNo].keyCenterPosX += shift;
        }
        _results.push(prevKeyType = keyInfo[noteNo].keyType);
      }
      return _results;
    };

    return PianoKeyboardDesign;

  })();

  PianoKey = (function() {

    function PianoKey(design, note) {
      var Black, KeyType, blackKeyColor, blackKeyHeight, blackKeyLength, blackKeyPosY, blackKeyPosZ, blackKeyWidth, geometry, keyCenterPosX, keyDip, keyInfo, keyType, keyUpSpeed, material, position, whiteKeyColor, whiteKeyHeight, whiteKeyLength, whiteKeyWidth, _ref;
      blackKeyWidth = design.blackKeyWidth, blackKeyHeight = design.blackKeyHeight, blackKeyLength = design.blackKeyLength, blackKeyColor = design.blackKeyColor, whiteKeyWidth = design.whiteKeyWidth, whiteKeyHeight = design.whiteKeyHeight, whiteKeyLength = design.whiteKeyLength, whiteKeyColor = design.whiteKeyColor, blackKeyPosY = design.blackKeyPosY, blackKeyPosZ = design.blackKeyPosZ, keyDip = design.keyDip, keyInfo = design.keyInfo, keyUpSpeed = design.keyUpSpeed, KeyType = design.KeyType;
      Black = KeyType.Black;
      _ref = keyInfo[note], keyType = _ref.keyType, keyCenterPosX = _ref.keyCenterPosX;
      if (keyType === Black) {
        geometry = new THREE.CubeGeometry(blackKeyWidth, blackKeyHeight, blackKeyLength);
        material = new THREE.MeshPhongMaterial({
          color: blackKeyColor
        });
        position = new THREE.Vector3(keyCenterPosX, blackKeyPosY, blackKeyPosZ);
      } else {
        geometry = new THREE.CubeGeometry(whiteKeyWidth, whiteKeyHeight, whiteKeyLength);
        material = new THREE.MeshPhongMaterial({
          color: whiteKeyColor,
          emissive: 0x111111
        });
        position = new THREE.Vector3(keyCenterPosX, 0, 0);
      }
      this.model = new THREE.Mesh(geometry, material);
      this.model.position.copy(position);
      this.keyUpSpeed = keyUpSpeed;
      this.originalY = position.y;
      this.pressedY = this.originalY - keyDip;
    }

    PianoKey.prototype.press = function() {
      this.model.position.y = this.pressedY;
      return this.isPressed = true;
    };

    PianoKey.prototype.release = function() {
      return this.isPressed = false;
    };

    PianoKey.prototype.update = function() {
      var offset;
      if (this.model.position.y < this.originalY && !this.isPressed) {
        offset = this.originalY - this.model.position.y;
        return this.model.position.y += Math.min(offset, this.keyUpSpeed);
      }
    };

    return PianoKey;

  })();

  PianoKeyboard = (function() {

    function PianoKeyboard(design, noteToColor) {
      this.update = __bind(this.update, this);
      var key, note, _i, _ref;
      this.model = new THREE.Object3D();
      this.keys = [];
      for (note = _i = 0, _ref = design.keyInfo.length; 0 <= _ref ? _i < _ref : _i > _ref; note = 0 <= _ref ? ++_i : --_i) {
        key = new PianoKey(design, note);
        this.keys.push(key);
        if ((20 < note && note < 109)) {
          this.model.add(key.model);
        }
      }
      this.model.y -= design.whiteKeyHeight / 2;
    }

    PianoKeyboard.prototype.press = function(note) {
      return this.keys[note].press();
    };

    PianoKeyboard.prototype.release = function(note) {
      return this.keys[note].release();
    };

    PianoKeyboard.prototype.update = function() {
      var key, _i, _len, _ref, _results;
      _ref = this.keys;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        _results.push(key.update());
      }
      return _results;
    };

    return PianoKeyboard;

  })();

  this.PianoKeyboardDesign = PianoKeyboardDesign;

  this.PianoKeyboard = PianoKeyboard;

}).call(this);
// Generated by CoffeeScript 1.5.0
(function() {
  var NoteRain,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  NoteRain = (function() {

    NoteRain.prototype.lengthScale = 0.001;

    function NoteRain(pianoDesign) {
      this.pianoDesign = pianoDesign;
      this.update = __bind(this.update, this);
      this.model = new THREE.Object3D();
    }

    NoteRain.prototype.setMidiData = function(midiData, callback) {
      var noteInfos;
      this.clear();
      noteInfos = this._getNoteInfos(midiData);
      return this._buildNoteMeshes(noteInfos, callback);
    };

    NoteRain.prototype.clear = function() {
      var child, _i, _len, _ref, _results;
      _ref = this.model.children.slice(0);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        _results.push(this.model.remove(child));
      }
      return _results;
    };

    NoteRain.prototype._getNoteInfos = function(midiData) {
      var channel, currentTime, duration, event, interval, noteInfos, noteNumber, noteTimes, startTime, subtype, _i, _len, _ref, _ref1;
      currentTime = 0;
      noteInfos = [];
      noteTimes = [];
      for (_i = 0, _len = midiData.length; _i < _len; _i++) {
        _ref = midiData[_i], (_ref1 = _ref[0], event = _ref1.event), interval = _ref[1];
        currentTime += interval;
        subtype = event.subtype, noteNumber = event.noteNumber, channel = event.channel;
        if (channel === 9) {
          continue;
        }
        if (subtype === 'noteOn') {
          noteTimes[noteNumber] = currentTime;
        } else if (subtype === 'noteOff') {
          startTime = noteTimes[noteNumber];
          duration = currentTime - startTime;
          noteInfos.push({
            noteNumber: noteNumber,
            startTime: startTime,
            duration: duration
          });
        }
      }
      return noteInfos;
    };

    NoteRain.prototype._buildNoteMeshes = function(noteInfos, callback) {
      var Black, KeyType, SIZE_OF_EACH_GROUP, blackKeyHeight, blackKeyWidth, group, groups, keyInfo, noteToColor, sleepTask, splitToGroups, tasks, _i, _len, _ref,
        _this = this;
      _ref = this.pianoDesign, blackKeyWidth = _ref.blackKeyWidth, blackKeyHeight = _ref.blackKeyHeight, keyInfo = _ref.keyInfo, KeyType = _ref.KeyType, noteToColor = _ref.noteToColor;
      Black = KeyType.Black;
      splitToGroups = function(items, sizeOfEachGroup) {
        var groups, i, numGroups, start, _i;
        groups = [];
        numGroups = Math.ceil(items.length / sizeOfEachGroup);
        start = 0;
        for (i = _i = 0; 0 <= numGroups ? _i < numGroups : _i > numGroups; i = 0 <= numGroups ? ++_i : --_i) {
          groups[i] = items.slice(start, start + sizeOfEachGroup);
          start += sizeOfEachGroup;
        }
        return groups;
      };
      sleepTask = function(done) {
        return setTimeout((function() {
          return done(null);
        }), 0);
      };
      tasks = [];
      SIZE_OF_EACH_GROUP = 100;
      groups = splitToGroups(noteInfos, SIZE_OF_EACH_GROUP);
      for (_i = 0, _len = groups.length; _i < _len; _i++) {
        group = groups[_i];
        tasks.push(sleepTask);
        tasks.push((function(group) {
          return function(done) {
            var color, duration, geometry, length, material, mesh, noteInfo, noteNumber, startTime, x, y, z, _j, _len1;
            for (_j = 0, _len1 = group.length; _j < _len1; _j++) {
              noteInfo = group[_j];
              noteNumber = noteInfo.noteNumber, startTime = noteInfo.startTime, duration = noteInfo.duration;
              length = duration * _this.lengthScale;
              x = keyInfo[noteNumber].keyCenterPosX;
              y = startTime * _this.lengthScale + (length / 2);
              z = -0.2;
              if (keyInfo[noteNumber].keyType === Black) {
                y += blackKeyHeight / 2;
              }
              color = noteToColor(noteNumber);
              geometry = new THREE.CubeGeometry(blackKeyWidth, length, blackKeyWidth);
              material = new THREE.MeshPhongMaterial({
                color: color,
                emissive: color,
                opacity: 0.7,
                transparent: true
              });
              mesh = new THREE.Mesh(geometry, material);
              mesh.position.set(x, y, z);
              _this.model.add(mesh);
            }
            return done(null);
          };
        })(group));
      }
      return async.series(tasks, function() {
        return typeof callback === "function" ? callback() : void 0;
      });
    };

    NoteRain.prototype.update = function(playerCurrentTime) {
      return this.model.position.y = -playerCurrentTime * this.lengthScale;
    };

    return NoteRain;

  })();

  this.NoteRain = NoteRain;

}).call(this);
// Generated by CoffeeScript 1.5.0
(function() {
  var NoteParticles,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  NoteParticles = (function() {

    NoteParticles.prototype.count = 30;

    NoteParticles.prototype.size = 0.2;

    NoteParticles.prototype.life = 10;

    function NoteParticles(pianoDesign) {
      var color, keyInfo, note, noteToColor, _i, _ref;
      this.pianoDesign = pianoDesign;
      this.createParticles = __bind(this.createParticles, this);
      this.update = __bind(this.update, this);
      noteToColor = pianoDesign.noteToColor, keyInfo = pianoDesign.keyInfo;
      this.model = new THREE.Object3D();
      this.materials = [];
      for (note = _i = 0, _ref = keyInfo.length; 0 <= _ref ? _i < _ref : _i > _ref; note = 0 <= _ref ? ++_i : --_i) {
        color = noteToColor(note);
        this.materials[note] = new THREE.ParticleBasicMaterial({
          size: this.size,
          map: this._generateTexture(color),
          blending: THREE.AdditiveBlending,
          transparent: true,
          depthWrite: false,
          color: color
        });
      }
    }

    NoteParticles.prototype._generateTexture = function(hexColor) {
      var canvas, context, gradient, height, texture, width;
      width = 32;
      height = 32;
      canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      width = canvas.width, height = canvas.height;
      context = canvas.getContext('2d');
      gradient = context.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width / 2);
      gradient.addColorStop(0, (new THREE.Color(hexColor)).getContextStyle());
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);
      texture = new THREE.Texture(canvas, new THREE.UVMapping(), THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.NearestFilter, THREE.LinearMipMapLinearFilter);
      texture.needsUpdate = true;
      return texture;
    };

    NoteParticles.prototype.update = function() {
      var particle, particleSystem, _i, _j, _len, _len1, _ref, _ref1, _results;
      _ref = this.model.children.slice(0);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        particleSystem = _ref[_i];
        if (particleSystem.age++ > this.life) {
          _results.push(this.model.remove(particleSystem));
        } else {
          _ref1 = particleSystem.geometry.vertices;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            particle = _ref1[_j];
            particle.addSelf(particle.velocity);
          }
          _results.push(particleSystem.geometry.verticesNeedUpdate = true);
        }
      }
      return _results;
    };

    NoteParticles.prototype.createParticles = function(note) {
      var Black, KeyType, geometry, i, keyCenterPosX, keyInfo, keyType, material, particle, particleSystem, posX, posY, posZ, _i, _ref, _ref1, _ref2;
      _ref = this.pianoDesign, keyInfo = _ref.keyInfo, KeyType = _ref.KeyType;
      Black = KeyType.Black;
      _ref1 = keyInfo[note], keyCenterPosX = _ref1.keyCenterPosX, keyType = _ref1.keyType;
      posX = keyCenterPosX;
      posY = keyType === Black ? 0.18 : 0.13;
      posZ = -0.2;
      geometry = new THREE.Geometry();
      for (i = _i = 0, _ref2 = this.count; 0 <= _ref2 ? _i < _ref2 : _i > _ref2; i = 0 <= _ref2 ? ++_i : --_i) {
        particle = new THREE.Vector3(posX, posY, posZ);
        particle.velocity = new THREE.Vector3((Math.random() - 0.5) * 0.04, (Math.random() - 0.3) * 0.01, (Math.random() - 0.5) * 0.04);
        geometry.vertices.push(particle);
      }
      material = this.materials[note];
      particleSystem = new THREE.ParticleSystem(geometry, material);
      particleSystem.age = 0;
      particleSystem.transparent = true;
      particleSystem.opacity = 0.8;
      return this.model.add(particleSystem);
    };

    return NoteParticles;

  })();

  this.NoteParticles = NoteParticles;

}).call(this);
// Generated by CoffeeScript 1.5.0
(function() {
  var Scene,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Scene = (function() {

    function Scene(container) {
      this.animate = __bind(this.animate, this);
      this.onresize = __bind(this.onresize, this);
      var $container, ambientLight, auxLight, camera, controls, height, mainLight, renderer, scene, width;
      $container = $(container);
      width = $container.width();
      height = $container.height();
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(60, width / height, 0.001, 100000);
      camera.lookAt(new THREE.Vector3());
      scene.add(camera);
      renderer = new THREE.WebGLRenderer({
        antialias: true
      });
      renderer.setSize(width, height);
      renderer.setClearColor(0x000000, 1);
      renderer.autoClear = false;
      $container.append(renderer.domElement);
      ambientLight = new THREE.AmbientLight(0x222222);
      scene.add(ambientLight);
      mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
      mainLight.position.set(1, 2, 4).normalize();
      scene.add(mainLight);
      auxLight = new THREE.DirectionalLight(0xffffff, 0.3);
      auxLight.position.set(-4, -1, -2).normalize();
      scene.add(auxLight);
      controls = new THREE.OrbitControls(camera);
      controls.center.set(8.73, 0, 0);
      controls.autoRotateSpeed = 1.0;
      controls.autoRotate = false;
      camera.position.copy(controls.center).addSelf(new THREE.Vector3(2, 6, 9));
      $(window).resize(this.onresize);
      this.$container = $container;
      this.camera = camera;
      this.scene = scene;
      this.renderer = renderer;
      this.controls = controls;
    }

    Scene.prototype.onresize = function() {
      var height, width, _ref;
      _ref = [this.$container.width(), this.$container.height()], width = _ref[0], height = _ref[1];
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      return this.renderer.setSize(width, height);
    };

    Scene.prototype.add = function(object) {
      return this.scene.add(object);
    };

    Scene.prototype.remove = function(object) {
      return this.scene.remove(object);
    };

    Scene.prototype.animate = function(callback) {
      var _this = this;
      requestAnimationFrame(function() {
        return _this.animate(callback);
      });
      if (typeof callback === "function") {
        callback();
      }
      this.controls.update();
      this.renderer.clear();
      return this.renderer.render(this.scene, this.camera);
    };

    return Scene;

  })();

  this.Scene = Scene;

}).call(this);
// Generated by CoffeeScript 1.5.0
(function() {
  var LoaderWidget,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  LoaderWidget = (function() {

    LoaderWidget.prototype.opts = {
      color: '#aaaaaa',
      width: 4
    };

    function LoaderWidget() {
      this.stop = __bind(this.stop, this);
      this.start = __bind(this.start, this);
      this.message = __bind(this.message, this);
      this.onresize = __bind(this.onresize, this);      this.window = $(window);
      this.overlay = $('<div>').width(this.window.width()).height(this.window.height()).hide().css({
        position: 'absolute',
        top: 0,
        left: 0,
        'z-index': 10000,
        background: 'rgba(0, 0, 0, 0.7)',
        'text-align': 'center'
      }).appendTo(document.body).on('selectstart', (function() {
        return false;
      }));
      this.box = $('<div>').width(300).height(200).appendTo(this.overlay);
      this.canvas = $('<div>').height(100).appendTo(this.box);
      this.text = $('<div>').css({
        color: '#ddd',
        'font-size': '12px',
        cursor: 'default'
      }).appendTo(this.box);
      this.onresize();
      this.window.resize(this.onresize);
    }

    LoaderWidget.prototype.onresize = function() {
      var height, width, _ref;
      _ref = [this.window.width(), this.window.height()], width = _ref[0], height = _ref[1];
      this.box.css({
        position: 'absolute',
        top: (height - 200) / 2,
        left: (width - 300) / 2
      });
      return this.overlay.width(width).height(height);
    };

    LoaderWidget.prototype.message = function(msg, callback) {
      if (msg != null) {
        this.text.html(msg);
      }
      if (this.isActive) {
        return typeof callback === "function" ? callback() : void 0;
      } else {
        return this.start(callback);
      }
    };

    LoaderWidget.prototype.start = function(callback) {
      var _this = this;
      this.overlay.fadeIn(function() {
        return typeof callback === "function" ? callback() : void 0;
      });
      if (this.spin) {
        this.spin.spin(this.canvas[0]);
      } else {
        this.spin = new Spinner(this.opts);
        this.spin.spin(this.canvas[0]);
      }
      return this.isActive = true;
    };

    LoaderWidget.prototype.stop = function(callback) {
      var _this = this;
      return this.overlay.fadeOut('slow', function() {
        var _ref;
        if ((_ref = _this.spin) != null) {
          _ref.stop();
        }
        _this.isActive = false;
        return typeof callback === "function" ? callback() : void 0;
      });
    };

    return LoaderWidget;

  })();

  this.LoaderWidget = LoaderWidget;

}).call(this);
// Generated by CoffeeScript 1.5.0
(function() {
  var PlayerWidget,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  PlayerWidget = (function() {

    function PlayerWidget(container) {
      this.displayProgress = __bind(this.displayProgress, this);
      this.getRandomTrack = __bind(this.getRandomTrack, this);
      this.setTrackFromHash = __bind(this.setTrackFromHash, this);
      this.setTrack = __bind(this.setTrack, this);
      this.ontrackchange = __bind(this.ontrackchange, this);
      this.onnext = __bind(this.onnext, this);
      this.onprev = __bind(this.onprev, this);
      this.onstop = __bind(this.onstop, this);
      this.onresume = __bind(this.onresume, this);
      this.onpause = __bind(this.onpause, this);
      this.onplay = __bind(this.onplay, this);
      this.hide = __bind(this.hide, this);
      this.show = __bind(this.show, this);
      this.updateSize = __bind(this.updateSize, this);
      this.autoHide = __bind(this.autoHide, this);
      var _this = this;
      this.$container = $(container);
      this.$controlsContainer = $('.player-controls', this.$container);
      this.$playlistContainer = $('.player-playlist-container', this.$container);
      this.$progressContainer = $('.player-progress-container', this.$container);
      this.$progressBar = $('.player-progress-bar', this.$container);
      this.$progressText = $('.player-progress-text', this.$container);
      this.$playlist = $('.player-playlist', this.$container);
      this.$prevBtn = $('.player-prev', this.$container);
      this.$nextBtn = $('.player-next', this.$container);
      this.$playBtn = $('.player-play', this.$container);
      this.$stopBtn = $('.player-stop', this.$container);
      this.$pauseBtn = $('.player-pause', this.$container);
      this.$prevBtn.click(function() {
        return _this.onprev();
      });
      this.$nextBtn.click(function() {
        return _this.onnext();
      });
      this.$stopBtn.click(function() {
        return _this.stop();
      });
      this.$pauseBtn.click(function() {
        return _this.pause();
      });
      this.$playBtn.click(function() {
        if (_this.current === 'paused') {
          return _this.resume();
        } else {
          return _this.play();
        }
      });
      this.$progressContainer.click(function(event) {
        var progress;
        progress = (event.clientX - _this.$progressContainer.offset().left) / _this.$progressContainer.width();
        return typeof _this.progressCallback === "function" ? _this.progressCallback(progress) : void 0;
      });
      this.$playlist.click(function(event) {
        var $list, $target;
        $target = $(event.target);
        if ($target.is('li')) {
          $list = $('li', _this.$playlist);
          return _this.setTrack($list.index($target));
        }
      });
      this.$container.on('mousewheel', function(event) {
        return event.stopPropagation();
      });
      this.updateSize();
      $(window).resize(this.updateSize);
      $(window).on('hashchange', this.setTrackFromHash);
    }

    PlayerWidget.prototype.autoHide = function() {
      var onmousemove,
        _this = this;
      onmousemove = function(event) {
        if (event.pageX < 400) {
          return _this.show();
        } else {
          return _this.hide();
        }
      };
      return $(document).on('mousemove', onmousemove).on('mousedown', function() {
        return $(this).off('mousemove', onmousemove);
      }).on('mouseup', function() {
        return $(this).on('mousemove', onmousemove);
      });
    };

    PlayerWidget.prototype.updateSize = function() {
      return this.$playlistContainer.height(this.$container.innerHeight() - this.$controlsContainer.outerHeight(true) - this.$progressContainer.outerHeight(true) - 15).nanoScroller();
    };

    PlayerWidget.prototype.show = function(callback) {
      var _this = this;
      if (this.visible || this.animating) {
        return;
      }
      this.visible = true;
      this.animating = true;
      return this.$container.animate({
        left: '0px'
      }, {
        duration: 500,
        easing: 'easeInOutCubic',
        complete: function() {
          _this.animating = false;
          return typeof callback === "function" ? callback() : void 0;
        }
      });
    };

    PlayerWidget.prototype.hide = function(callback) {
      var _this = this;
      if (!this.visible || this.animating) {
        return;
      }
      this.visible = false;
      this.animating = true;
      return this.$container.animate({
        left: "" + (-this.$container.width()) + "px"
      }, {
        duration: 500,
        easing: 'easeInOutCubic',
        complete: function() {
          _this.animating = false;
          return typeof callback === "function" ? callback() : void 0;
        }
      });
    };

    PlayerWidget.prototype.setPlaylist = function(playlist) {
      var trackName, _i, _len;
      this.playlist = playlist;
      this.$playlist.html('');
      for (_i = 0, _len = playlist.length; _i < _len; _i++) {
        trackName = playlist[_i];
        this.$playlist.append($('<li>').text(trackName));
      }
      return this.$playlistContainer.nanoScroller();
    };

    PlayerWidget.prototype.on = function(eventName, callback) {
      return this["" + eventName + "Callback"] = callback;
    };

    PlayerWidget.prototype.onplay = function() {
      this.$playBtn.hide();
      this.$pauseBtn.show();
      return typeof this.playCallback === "function" ? this.playCallback() : void 0;
    };

    PlayerWidget.prototype.onpause = function() {
      this.$pauseBtn.hide();
      this.$playBtn.show();
      return typeof this.pauseCallback === "function" ? this.pauseCallback() : void 0;
    };

    PlayerWidget.prototype.onresume = function() {
      this.$playBtn.hide();
      this.$pauseBtn.show();
      return typeof this.resumeCallback === "function" ? this.resumeCallback() : void 0;
    };

    PlayerWidget.prototype.onstop = function() {
      this.$pauseBtn.hide();
      this.$playBtn.show();
      return typeof this.stopCallback === "function" ? this.stopCallback() : void 0;
    };

    PlayerWidget.prototype.onprev = function() {
      if (!(this.currentTrackId > 0)) {
        return;
      }
      this.currentTrackId -= 1;
      return this.setTrack(this.currentTrackId);
    };

    PlayerWidget.prototype.onnext = function() {
      if (!(this.currentTrackId < this.playlist.length - 1)) {
        return;
      }
      this.currentTrackId += 1;
      return this.setTrack(this.currentTrackId);
    };

    PlayerWidget.prototype.ontrackchange = function(trackId) {
      var _ref;
      if (!((0 <= trackId && trackId < this.playlist.length))) {
        return;
      }
      this.stop();
      if ((_ref = this.$currentTrack) != null) {
        _ref.removeClass('player-current-track');
      }
      this.$currentTrack = this.$playlist.find("li").eq(trackId).addClass('player-current-track');
      if (typeof this.trackchangeCallback === "function") {
        this.trackchangeCallback(trackId);
      }
      return this.currentTrackId = trackId;
    };

    PlayerWidget.prototype.setTrack = function(trackId) {
      return window.location.hash = trackId + 1;
    };

    PlayerWidget.prototype.setTrackFromHash = function() {
      var hash;
      hash = window.location.hash.slice(1);
      if (hash) {
        return this.ontrackchange(parseInt(hash, 10) - 1);
      }
    };

    PlayerWidget.prototype.getRandomTrack = function() {
      return this.playlist[Math.floor(Math.random() * this.playlist.length)];
    };

    PlayerWidget.prototype.displayProgress = function(event) {
      var curTime, current, progress, totTime, total;
      current = event.current, total = event.total;
      current = Math.min(current, total);
      progress = current / total;
      this.$progressBar.width(this.$progressContainer.width() * progress);
      curTime = this._formatTime(current);
      totTime = this._formatTime(total);
      return this.$progressText.text("" + curTime + " / " + totTime);
    };

    PlayerWidget.prototype._formatTime = function(time) {
      var minutes, seconds;
      minutes = time / 60 >> 0;
      seconds = String(time - (minutes * 60) >> 0);
      if (seconds.length === 1) {
        seconds = "0" + seconds;
      }
      return "" + minutes + ":" + seconds;
    };

    return PlayerWidget;

  })();

  StateMachine.create({
    target: PlayerWidget.prototype,
    events: [
      {
        name: 'init',
        from: 'none',
        to: 'ready'
      }, {
        name: 'play',
        from: 'ready',
        to: 'playing'
      }, {
        name: 'pause',
        from: 'playing',
        to: 'paused'
      }, {
        name: 'resume',
        from: 'paused',
        to: 'playing'
      }, {
        name: 'stop',
        from: '*',
        to: 'ready'
      }
    ]
  });

  this.PlayerWidget = PlayerWidget;

}).call(this);
// Generated by CoffeeScript 1.5.0
(function() {
  var Euphony,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Euphony = (function() {

    function Euphony() {
      this.setProgress = __bind(this.setProgress, this);
      this.setCurrentTime = __bind(this.setCurrentTime, this);
      this.getEndTime = __bind(this.getEndTime, this);
      this.pause = __bind(this.pause, this);
      this.stop = __bind(this.stop, this);
      this.resume = __bind(this.resume, this);
      this.start = __bind(this.start, this);
      var _this = this;
      this.design = new PianoKeyboardDesign();
      this.keyboard = new PianoKeyboard(this.design);
      this.rain = new NoteRain(this.design);
      this.particles = new NoteParticles(this.design);
      this.player = MIDI.Player;
      this.player.addListener(function(data) {
        var NOTE_OFF, NOTE_ON, message, note;
        NOTE_OFF = 128;
        NOTE_ON = 144;
        note = data.note, message = data.message;
        if (message === NOTE_ON) {
          _this.keyboard.press(note);
          return _this.particles.createParticles(note);
        } else if (message === NOTE_OFF) {
          return _this.keyboard.release(note);
        }
      });
      this.player.setAnimation({
        delay: 20,
        callback: function(data) {
          var end, now;
          now = data.now, end = data.end;
          if (typeof _this.onprogress === "function") {
            _this.onprogress({
              current: now,
              total: end
            });
          }
          return _this.rain.update(now * 1000);
        }
      });
    }

    Euphony.prototype.initScene = function() {
      var _this = this;
      this.scene = new Scene('#canvas');
      this.scene.add(this.keyboard.model);
      this.scene.add(this.rain.model);
      this.scene.add(this.particles.model);
      return this.scene.animate(function() {
        _this.keyboard.update();
        return _this.particles.update();
      });
    };

    Euphony.prototype.initMidi = function(callback) {
      return MIDI.loadPlugin(function() {
        MIDI.channels[9].mute = true;
        return typeof callback === "function" ? callback() : void 0;
      });
    };

    Euphony.prototype.loadBuiltinPlaylist = function(callback) {
      var _this = this;
      if (this.playlist) {
        return callback(this.playlist);
      }
      return $.getJSON('tracks/index.json', function(playlist) {
        _this.playlist = playlist;
        return callback(_this.playlist);
      });
    };

    Euphony.prototype.loadBuiltinMidi = function(id, callback) {
      var _this = this;
      if (!((0 <= id && id < this.playlist.length))) {
        return;
      }
      if (typeof localStorage !== "undefined" && localStorage !== null ? localStorage[id] : void 0) {
        return this.loadMidiFile(localStorage[id], callback);
      }
      return $.ajax({
        url: "tracks/" + this.playlist[id],
        dataType: 'text',
        success: function(data) {
          _this.loadMidiFile(data, callback);
          try {
            return typeof localStorage !== "undefined" && localStorage !== null ? localStorage[id] = data : void 0;
          } catch (e) {
            return typeof console !== "undefined" && console !== null ? console.error('localStorage quota limit reached') : void 0;
          }
        }
      });
    };

    Euphony.prototype.loadMidiFile = function(midiFile, callback) {
      var _this = this;
      return this.player.loadFile(midiFile, function() {
        return _this.rain.setMidiData(_this.player.data, callback);
      });
    };

    Euphony.prototype.start = function() {
      this.player.start();
      return this.playing = true;
    };

    Euphony.prototype.resume = function() {
      this.player.currentTime += 1e-6;
      this.player.resume();
      return this.playing = true;
    };

    Euphony.prototype.stop = function() {
      this.player.stop();
      return this.playing = false;
    };

    Euphony.prototype.pause = function() {
      this.player.pause();
      return this.playing = false;
    };

    Euphony.prototype.getEndTime = function() {
      return this.player.endTime;
    };

    Euphony.prototype.setCurrentTime = function(currentTime) {
      this.player.pause();
      this.player.currentTime = currentTime;
      if (this.playing) {
        return this.player.resume();
      }
    };

    Euphony.prototype.setProgress = function(progress) {
      var currentTime;
      currentTime = this.player.endTime * progress;
      return this.setCurrentTime(currentTime);
    };

    Euphony.prototype.on = function(eventName, callback) {
      return this["on" + eventName] = callback;
    };

    return Euphony;

  })();

  this.Euphony = Euphony;

}).call(this);
// Generated by CoffeeScript 1.5.0
(function() {

  $(document).on('selectstart', function() {
    return false;
  }).on('mousewheel', function() {
    return false;
  }).on('dragover', function() {
    return false;
  }).on('dragenter', function() {
    return false;
  }).on('ready', function() {
    window.loader = new LoaderWidget();
    loader.message('Downloading');
    window.app = new Euphony();
    return app.initMidi(function() {
      app.initScene();
      return app.loadBuiltinPlaylist(function(playlist) {
        window.player = new PlayerWidget('#player');
        player.setPlaylist(playlist);
        player.on('pause', app.pause);
        player.on('resume', app.resume);
        player.on('stop', app.stop);
        player.on('play', app.start);
        player.on('progress', app.setProgress);
        player.on('trackchange', function(trackId) {
          return loader.message('Loading MIDI', function() {
            return app.loadBuiltinMidi(trackId, function() {
              return loader.stop(function() {
                return player.play();
              });
            });
          });
        });
        player.on('filedrop', function(midiFile) {
          player.stop();
          return loader.message('Loading MIDI', function() {
            return app.loadMidiFile(midiFile, function() {
              return loader.stop(function() {
                return player.play();
              });
            });
          });
        });
        app.on('progress', player.displayProgress);
        player.show(function() {
          var candidates, id;
          if (window.location.hash) {
            return player.setTrackFromHash();
          } else {
            candidates = [3, 5, 6, 7, 10, 11, 12, 13, 14, 16, 19, 30];
            id = Math.floor(Math.random() * candidates.length);
            return player.setTrack(candidates[id]);
          }
        });
        setTimeout((function() {
          player.hide();
          return player.autoHide();
        }), 5000);
        return $(document).on('drop', function(event) {
          var file, files, reader;
          event || (event = window.event);
          event.preventDefault();
          event.stopPropagation();
          event = event.originalEvent || event;
          files = event.files || event.dataTransfer.files;
          file = files[0];
          reader = new FileReader();
          reader.onload = function(e) {
            var midiFile;
            midiFile = e.target.result;
            player.stop();
            return loader.message('Loading MIDI', function() {
              return app.loadMidiFile(midiFile, function() {
                return loader.stop(function() {
                  return player.play();
                });
              });
            });
          };
          return reader.readAsDataURL(file);
        });
      });
    });
  });

}).call(this);
