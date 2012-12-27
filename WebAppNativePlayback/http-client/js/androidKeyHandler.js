// Copyright 2012 Google Inc. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * The key handler will parse URI's from the native application and handle
 * d-pad key presses from the native application
 *
 * @constructor
 * @param {FocusController} focusController
 */
function AndroidKeyHandler(fController) {
    var focusController = fController;

    /*
    * Get the focus controller to call the relevant methods
    */
    this.getFocusController = function () {
        return focusController;
    };

    this.URI_PREFIX = 'nativewebsample://';
    this.ACTION_KEY_EVENT = 'KEY_EVENT';
}

/**
* Handle a URI from the native application
* @function
* @param {String} uri The uri received of the application
*/
AndroidKeyHandler.prototype.handleUri = function (uri) {
    if(uri.indexOf(this.URI_PREFIX) !== 0) {
        // Invalid uri for us to handle
        return;
    }

    uri = uri.substring(this.URI_PREFIX.length, uri.length);

    var uriParts = uri.split(';');
    if(!uriParts || !uriParts.length || uriParts.length === 0) {
        return;
    }

    var action = uriParts[0];
    if(action == this.ACTION_KEY_EVENT) {
        this.handleNativeKeyPress(uriParts[1]);
    }
};

/**
* Handle a keypress directly from the native app
* @function
* @param {int} keyCode The native Android key code
*/
AndroidKeyHandler.prototype.handleNativeKeyPress = function (keyCode) {
    var focusController = this.getFocusController();
    switch(parseInt(keyCode, 10)) {
        case 23:
            // DPAD Center
            console.log("Native Enter");
            if(focusController.getCurrentlyFocusedItem()) {
                focusController.getCurrentlyFocusedItem().onItemClick();
            }
            break;
        case 20:
            // DPAD Down
            console.log("Native Down Pressed");
            focusController.moveFocus({x: 0, y: -1});
            break;
        case 21:
            // DPAD Left
            console.log("Native Left Pressed");
            focusController.moveFocus({x: -1, y: 0});
            break;
        case 22:
            // DPAD Right
            console.log("Native RIGHT Pressed");
            focusController.moveFocus({x: 1, y: 0});
            break;
        case 19:
            // DPAD Up
            console.log("Native UP Pressed");
            focusController.moveFocus({x: 0, y: 1});
            break;
        default:
            console.log("Keycode not registered");
            break;
    }
};
