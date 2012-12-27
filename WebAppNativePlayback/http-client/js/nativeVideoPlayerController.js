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

NativeVideoPlayerController.prototype = new GenericVideoPlayerController();

/**
 * This handles the playback through a native VideoView rather than a HTML5
 * video tag
 *
 * @constructor
 * @augments GenericVideoPlayerController
 */
function NativeVideoPlayerController() {
    // This player requires a transparent body
    $('body').css('background-color', 'transparent');

    var autoPlay = true;

    /**
    * Check is the video player is set to auto play
    */
    this.isAutoPlay = function () {
        return autoPlay;
    };
}

/**
* When a url has changed on the video this method is called to handle it
* @function
* @param {String} url
*/
NativeVideoPlayerController.prototype.onVideoUrlChange = function (url) {
    // Launch into native
    var autoPlayString = '';
    if(this.isAutoPlay()) {
        autoPlayString = ';'+this.isAutoPlay()+';';
    }
    this.handleAction('nativewebsample://ACTION_LOAD_VIDEO;' + url + autoPlayString);
};

/**
* Method to handle a play / pause toggle
* @function
*/
NativeVideoPlayerController.prototype.playPause = function () {
    this.handleAction('nativewebsample://ACTION_PLAY_PAUSE_VIDEO;');
};

/**
* This method handles an action which needs to be handled by the native
* application.
*
* This class does not perform any filtering / parsing of the URI to ensure
* it is valid, it relies on the Native application to handle the URI's
* appropriately.
*
* @function
* @param {String} action The action to pass to the native app
*/
NativeVideoPlayerController.prototype.handleAction = function (action) {
    if(typeof AppInterface == 'undefined' || !AppInterface) {
        console.log('The AppInterface object has not been defined [Have you set up your app client to inject this?]');
        return;
    }

    // App Interface is set by the Android client
    AppInterface.handleURI(action);
};

/**
* Rewind the application but the specified number of seconds defined in the
* GenericVideoPlayerController
* @function
*/
NativeVideoPlayerController.prototype.rewind = function () {
    this.handleAction('nativewebsample://ACTION_REWIND_VIDEO;'+this.getSkipSpeedSeconds()+';');
};

/**
* Fast forward the application but the specified number of seconds defined in the
* GenericVideoPlayerController
* @function
*/
NativeVideoPlayerController.prototype.fastForward = function () {
    this.handleAction('nativewebsample://ACTION_FASTFORWARD_VIDEO;'+this.getSkipSpeedSeconds()+';');
};
