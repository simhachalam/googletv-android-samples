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
 * This class is meant to be inherited to control Video playback and then
 * each class handles a different method of playback
 *
 * @constructor
 */
function GenericVideoPlayerController() {
    var playerCallback = null;
    var videoUrl = null;

    /**
    * Set a callback method for the player
    * @param {function} callback
    */
    this.setPlayerCallback = function (callback) {
        playerCallback = callback;
    };

    /**
    * Get a player callback
    */
    this.getPlayerCallback = function () {
        return playerCallback;
    };

    /**
    * Set the video url
    * @param {String} url
    */
    this.setVideoUrl = function (url) {
        videoUrl = url;

        this.onVideoUrlChange(url);
    };

    /**
    * Get the video url
    */
    this.getVideoUrl = function () {
        return videoUrl;
    };
}

/**
* A callback method on a url change
* @function
*/
GenericVideoPlayerController.prototype.onVideoUrlChange = function () {
    // NOOP
};

/**
* A method to toggle play / pause
* @function
*/
GenericVideoPlayerController.prototype.playPause = function () {
    // NOOP
};

/**
* Method to fast forward
* @function
*/
GenericVideoPlayerController.prototype.fastForward = function () {
    // NOOP
};

/**
* Method to rewind
* @function
*/
GenericVideoPlayerController.prototype.rewind = function () {
    // NOOP
};

/**
* Callback when the video has loaded
* @function
*/
GenericVideoPlayerController.prototype.onLoaded = function () {
    // NOOP
};

/**
* Callback for when the video has ended
* @function
*/
GenericVideoPlayerController.prototype.onEnded = function () {
    // NOOP
};

/**
* Get the number of seconds to skip in the fast forward and rewind
* @function
*/
GenericVideoPlayerController.prototype.getSkipSpeedSeconds = function () {
    return 10;
};

/**
* State playing
*/
var STATE_PLAYING = 'STATE_PLAYING';
/**
* State paused
*/
var STATE_PAUSED = 'STATE_PAUSED';
/**
* State stopped
*/
var STATE_STOPPED = 'STATE_STOPPED';

/**
* Video event - State change
*/
var VIDEO_EVENT_STATE_CHANGE = 'STATE_CHANGE';
/**
* Video event - Progress update
*/
var VIDEO_EVENT_PROGRESS_UPDATE = 'PROGRESS_UPDATE';
/**
* Video event - Update time
*/
var VIDEO_EVENT_TIME_UPDATE = 'TIME_UPDATE';
/**
* Video event - Duration change
*/
var VIDEO_EVENT_DURATION_CHANGE = 'DURATION_CHANGE';
/**
* Video event - Video loaded
*/
var VIDEO_EVENT_LOADED = 'LOADED';
/**
* Video event - Mouse moved
*/
var VIDEO_EVENT_MOUSE_MOVED = 'MOUSE_MOVED';
