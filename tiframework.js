/*
 * TiFramework for Titanium
 *
 * Copyright 2010, Rick Blalock
 * Licensed under the MIT
 * Copyright (c) 2010 Rick Blalock
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// Set current version and codename constants.  This is helpful if
// you need to work with different versions
// @TODO Not implemented yet
var TI_FRAMEWORK_VERSION 	= '0.1', 
	TI_FRAMEWORK_CODENAME 	= 'Zergling';

/**
 * The Framework class
 *
 * @param mixed context
 */	
function TiFramework(context) {
	// Return the new framework class
	return new TiFramework.prototype(context);
};

TiFramework.prototype = function(context) {
	// Make the context accessible
	this.context = context;
	
	// Return the object even if no context is provided
	if(!this.context) {
		return this;
	}
	
	/** 
	 * Handle new context
	 * @TODO create more
	 */
	if(typeof this.context === 'string') {
		// Determine the string context
		switch(this.context) {
			// @TODO Should these use the UI helper methods below and open automatically or defer to the open() method?
			// The latter is more verbose but gives more control on when UI elements are drawn out
			case 'window':
				this.context = Ti.UI.createWindow();
				break;
				
			case 'view':
				this.context = Ti.UI.createView();
				break;

			case 'table':
				this.context = Ti.UI.createTableView();
				break;				
				
			case 'label':
				this.context = Ti.UI.createLabel();
				break;	
				
			case 'tabgroup':
				this.context = Ti.UI.createTabGroup();
				break;
				
			case 'row':
				this.context = Ti.UI.createTableViewRow();
				break;
			
			case 'currentWin':
				this.context = Ti.UI.currentWindow;
				break;
		}
	}


/** --- EVENT HELPERS --- */

	/** Click event helper
	 *
	 * @param callback
	 */
	this.click = function(callback) {		
		this.context.addEventListener('click', function(e) {
			callback(e);
		});

		return this;
	};

/** --- UI UTILITIES --- */

	/** Attach data to the context (usually tableView)
	 *
	 * @param object data
	 */
	this.setData = function(data) {		
		this.context.data = data;
	
		return this;
	};

	/** Attach options to the context
	 *
	 * @param object opts
	 */
	this.setOpts = function(opts) {		

		for(var prop in opts) {
			this.context[prop] = opts[prop];
		}
	
		return this;
	};	

	/** Append current context to the indicated element
	 *
	 * @param object
	 */
	this.appendTo = function(element) {
		element.context.add(this.context);
	
		return this;
	};
	
	/** Append passed object to current context
	 *
	 * @param object
	 */
	this.append = function(element) {
		if( typeof(element.context) == 'undefined'){
			this.context.add(element);
		}else{
			this.context.add(element.context);
		}
	
		return this;
	};
	
	/** Wrapper for the native appendRow method
	 *
	 * @param object
	 */
	this.addRowTo = function(element) {
		element.context.appendRow(this.context);
	
		return this;
	};		
	
	/** Open the current context
	 *
	 * @param object opts
	 */
	this.open = function(opts) {
		this.context.open(opts);
		
		return this;
	};	

/** --- UI ELEMENTS --- */
	
	/** Create a general view object
	 *
	 * @param object opts
	 */
	this.view = function(opts) {
		var view = Ti.UI.createView(opts);
	
		this.context.add(view);
	
		return this;
	};

	/** Create and add a tableview
	 *
	 * @param object opts
	 */
	this.tableView = function(opts) {
		var tableview = Ti.UI.createTableView(opts);
		
		this.context.add(tableview);
		
		return this;
	};
	
	/** Create and add a row to an existing table
	 *
	 * @param object opts
	 * @param object props	
	 */
	this.row = function(opts, props) {
		var row = Ti.UI.createTableViewRow(opts);
		
		if(!props) {
			this.context.appendRow(row);			
		} else {
			this.context.appendRow(row, props);
		}
		
		return this;
	};		
	
	/** Create and add a label
	 *
	 * @param object opts
	 */
	this.label = function(opts) {
		var label = Ti.UI.createLabel(opts);
		
		this.context.add(label);
		
		return this;
	};
	
	/** Create and add a tab to a tab group
	 *
	 * @param object opts
	 */
	this.tab = function(opts) {
		var tab = Ti.UI.createTab(opts);
		
		this.context.addTab(tab);
		
		return this;
	};	
	

/** UTILITIES **/
	
	/** Return the global object */
	return this;
};


/** UTILITIY EXTENSTIONS **/

/**
 * Basic XHR connection
 *
 * @param object opts	
 */	
TiFramework.ajax = function(opts, callback) {
	// Setup the xhr object
	var xhr = Ti.Network.createHTTPClient();

	/**
		AVAILABLE OPTIONS
		
		timeout 	: int Timeout request
		type		: string GET/POST
		data		: mixed The data to pass
		url			: string The url source to call
		onerror		: funtion A function to execute when there is an XHR error
	*/

	// Set the timeout or a default if one is not provided
	xhr.timeout = (opts.timeout) ? opts.timeout : 10000;	

	// Error Handling
	xhr.onerror = function(e) {
		if(opts.onerror) {
			opts.onerror(e);				
		} else {
			Ti.API.info(e.error);
		}
	};


	// Execute when xhr is loaded
	xhr.onload = function() {
		// If successful
		try {
			if (this.responseText == 'null') {
				Ti.API.info(this);
			} else {
			
				// Store the response
				var data = eval('('+this.responseText+')');

				// Execute a callback function
				callback(data);
			}

		}
		// If not successful
		catch(e) {
			if(opts.onerror) {
				opts.onerror(e);				
			} else {
				Ti.API.info(e);
			}
		}
	};

	// Open the remote connection
	xhr.open(opts.type, opts.url);

	// send the data
	xhr.send(opts.data);	
};
