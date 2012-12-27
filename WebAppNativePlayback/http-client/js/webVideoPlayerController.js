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

WebVideoPlayerController.prototype = new GenericVideoPlayerController();

/**
 * This class handles the video playback via a HTML5 video tag
 *
 * @constructor
 * @augments GenericVideoPlayerController
 * @param {String} containerId ID of the div to add the video player to
 */
function WebVideoPlayerController(contId) {
  // Set up variables
  var containerId = contId;
  var videoElement = null;

  var loadedTime = 0;
  var playable = false;

  this.VIDEO_VIEW_CLASS = 'videoview';

  /**
  * Set the video DOM element
  * @param {DOMElement} videoElement The video DOM element
  */
  this.setVideoElement = function (v) {
    this.videoElement = v;
  };

  /**
  * Get the video element
  */
  this.getVideoElement = function () {
    return this.videoElement;
  };

  /**
  * Check to see if the video is playing
  */
  this.isPlaying = function () {
    if(this.videoElement) {
      return !(this.videoElement.paused ||
        this.videoElement.ended ||
        this.videoElement.stoped);
    }
    return false;
  };

  /**
  * Get the duration of the video
  */
  this.getDuration = function () {
    return this.videoElement.duration;
  };

  /**
  * This method updates the loaded time according to the video view
  */
  this.updateLoadedTime = function () {
    if(this.videoElement.buffered &&
      this.videoElement.buffered.length > 0) {
      this.loadedTime = this.videoElement.buffered.end(0);
    }
  };

  /**
  * Get the amount of video which is loaded
  */
  this.getLoadedTime = function () {
    return this.loadedTime;
  };

  /**
  * Get the amount of video already played
  */
  this.getElapsedTime = function () {
    return this.videoElement.currentTime;
  };

  /**
  * Get the ID of the div to place the video tag
  */
  this.getContainerId = function () {
    return containerId;
  };

  /**
  * This method informs whether the video player has loaded the video and is
  * ready to play
  */
  this.canPlay = function () {
    return playable;
  };

  /**
  * Sets whether the video player is ready to play
  * @param {Boolean} canPlay
  */
  this.setCanPlay = function (canPlay) {
    playable = canPlay;
  };

  /**
  * Add a new video player to the container ID. This is done when ever a new
  * video url is loaded. This is because there is a bug where the same video
  * tag cannot handle change src attributes and play video
  */
  this.addNewVideoPlayer = function () {
    $('#'+this.getContainerId()).empty();

    var video = $('<video></video>');

    video.addClass(this.VIDEO_VIEW_CLASS);
    video.css('width', '100%');
    video.css('height', '100%');

    video.bind('timeupdate', getCallback('onTimeUpdate').bind(this));
    video.bind('mousemove', getCallback('onMouseMove').bind(this));
    video.bind('ended', getCallback('onEnded').bind(this));
    video.bind('loadeddata', getCallback('onLoaded').bind(this));
    video.bind('durationchange', getCallback('onDurationChange').bind(this));
    video.bind('progress', getCallback('onProgressUpdate').bind(this));
    video.bind('canplay', function(e) {
      this.setCanPlay(true);
    }.bind(this), false);

    $('#'+this.getContainerId()).append(video);

    this.setVideoElement(video.get(0));
  };

  /**
  * This method just ensures callbacks are called with the right scope
  * @private
  */
  function getCallback(funcName) {
    return function() {
      this[funcName]();
    };
  }
}

/**
* Method called to handle a Video URL Change
* @function
* @param {String} url
*/
WebVideoPlayerController.prototype.onVideoUrlChange = function (url) {
  this.addNewVideoPlayer();

  if(this.getVideoElement()) {
    this.setCanPlay(false);
    $(this.getVideoElement()).attr('src', url);
    $(this.getVideoElement()).css('width', '100%');
    $(this.getVideoElement()).css('height', '100%');
    $(this.getVideoElement()).load();
  }
};

/**
* Update the loaded time of the video and handles any callback methods
* @function
*/
WebVideoPlayerController.prototype.onProgressUpdate = function () {
  this.updateLoadedTime();
  if(this.getPlayerCallback()) {
    this.getPlayerCallback()(VIDEO_EVENT_PROGRESS_UPDATE, this.getLoadedTime());
  }
};

/**
* This handles when the loaded time may need updating
* @function
*/
WebVideoPlayerController.prototype.onTimeUpdate = function () {
  var origLoadedTime = this.getLoadedTime();
  this.updateLoadedTime();
  if(origLoadedTime != this.getLoadedTime()) {
    this.onProgressUpdate();
  }

  if(this.getPlayerCallback()) {
    this.getPlayerCallback()(VIDEO_EVENT_TIME_UPDATE, this.getElapsedTime());
  }
};

/**
* Callback to handle the change in duration of the video
* @function
*/
WebVideoPlayerController.prototype.onDurationChange = function () {
  if(this.getPlayerCallback()) {
    this.getPlayerCallback()(VIDEO_EVENT_DURATION_CHANGE, this.getDuration());
  }
};

/**
* Callback when the video is loaded
* @function
*/
WebVideoPlayerController.prototype.onLoaded = function () {
  if(this.getPlayerCallback()) {
    this.getPlayerCallback()(VIDEO_EVENT_LOADED, this.getDuration());
  }
};

/**
* Callback when the video ends
* @function
*/
WebVideoPlayerController.prototype.onEnded = function () {
  if(this.getPlayerCallback()) {
    this.getPlayerCallback()(VIDEO_EVENT_STATE_CHANGE, STATE_STOPPED);
  }
};

/**
* Method to handle when the mouse moves
* @function
*/
WebVideoPlayerController.prototype.onMouseMove = function () {
  if(this.getPlayerCallback()) {
    this.getPlayerCallback()(VIDEO_EVENT_MOUSE_MOVED);
  }
};

/**
* Method to handle play / pause toggling
* @function
*/
WebVideoPlayerController.prototype.playPause = function () {
  var videoElement = this.getVideoElement();
  if(!videoElement || this.canPlay() === false) {
    return;
  }

  var state;
  if(this.isPlaying()) {
    videoElement.pause();
    state = STATE_PAUSED;
  } else {
    videoElement.play();
    state = STATE_PLAYING;
  }

  if(this.getPlayerCallback()) {
    this.getPlayerCallback()(VIDEO_EVENT_STATE_CHANGE, state);
  }
};

/**
* Method to handle fast forwarding the video
* @function
*/
WebVideoPlayerController.prototype.fastForward = function () {
  var videoElement = this.getVideoElement();
  if(!videoElement) {
    return;
  }

  videoElement.currentTime = videoElement.currentTime + this.getSkipSpeedSeconds();
};

/**
* Method to handle rewinding the video
* @function
*/
WebVideoPlayerController.prototype.rewind = function () {
  var videoElement = this.getVideoElement();
  if(!videoElement) {
    return;
  }

  videoElement.currentTime = videoElement.currentTime - this.getSkipSpeedSeconds();
};
