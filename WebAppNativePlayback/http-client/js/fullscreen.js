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
 * The constructor for the fullscren video page. Sets up video playback
 *
 * @constructor
 * @param {VideoDataController} videoDataController
 * @param {FocusController} focusController
 */
function FullscreenPage(vidDataController, fController) {
    // Set up variables
    var videoDataController = vidDataController;
    var focusController = fController;
    var categoryIndex = -1;
    var itemIndex = -1;
    var embedded = false;
    var videoPlayerController = null;
    var videoControlsController = null;

    /**
    * Get the selected category index
    */
    this.getCategoryIndex = function () {
        return categoryIndex;
    };

    /**
    * Set the selected category index
    * @param {int} index
    */
    this.setCategoryIndex = function (index) {
        categoryIndex = index;
    };

    /**
    * Get the selected item index
    */
    this.getItemIndex = function () {
        return itemIndex;
    };

    /**
    * Set the selected item index
    * @param {int} index
    */
    this.setItemIndex = function (index) {
        itemIndex = index;
    };

    /**
    * Set the embedded state
    * @param {boolean} isEmbedded
    */
    this.setEmbedded = function (isEmbedded) {
        embedded = isEmbedded;
    };

    /**
    * Check whether the view is embedded
    */
    this.isEmbedded = function () {
        return embedded;
    };

    /**
    * Get the VideoDataController
    */
    this.getVideoDataController = function () {
        return videoDataController;
    };

    /**
    * Set the VideoPlayerController for the view
    * @param {VideoPlayerController} controller
    */
    this.setVideoPlayerController = function (controller) {
        videoPlayerController = controller;
    };

    /**
    * Get the VideoPlayerController
    */
    this.getVideoPlayerController = function () {
        return videoPlayerController;
    };

    /**
    * Set the VideoControlsController for the view
    * @param {VideoControlsController} controller
    */
    this.setVideoControlsController = function (controller) {
        videoControlsController = controller;
    };

    /**
    * Get the VideoControlsController
    */
    this.getVideoControlsController = function () {
        return videoControlsController;
    };

    /**
    * Get a callback function for video control event
    */
    this.getOnVideoControlEventCallback = function () {
        return function(action) {
            this.onHandleVideoControlEventCommand(action);
        }.bind(this);
    };

    /**
    * Get a callback function for the video player event
    */
    this.getOnVideoPlayerEventCallback = function () {
        return function(type, data) {
            this.onVideoPlayerEvent(type, data);
        }.bind(this);
    };

    /**
    * Get the FocusController for the screen
    */
    this.getFocusController = function () {
        return focusController;
    };

    /**
    * The URI Prefix used by the native platform 'nativewebsample://'
    */
    this.URI_PREFIX = 'nativewebsample://';
}

/**
* Set up the page state
* @function
*/
FullscreenPage.prototype.setUpPageState = function () {
    var queryString = location.search;

    if (queryString.length < 1) {
        return;
    }

    var parms = queryString.substring(1).split('&');
    // We must have 2 or 3 parameters
    if (parms.length < 2) {
        return;
    }

    var paramSplit;
    var categoryIndex = -1;
    var itemIndex = -1;
    var embedded = false;

    var paramString;
    for(var  i = 0; i < parms.length; i++) {
        paramString = parms[i];
        paramSplit = paramString.split("=");
        if(paramSplit.length != 2) {
            continue;
        }

        if(paramSplit[0].toLowerCase() == 'category') {
            categoryIndex = parseInt(paramSplit[1], 10);
        } else if(paramSplit[0].toLowerCase() == 'item') {
            itemIndex = parseInt(paramSplit[1], 10);
        } else if(paramSplit[0].toLowerCase() == 'embedded') {
            embedded = paramSplit[1].toLowerCase() == 'true';
        }
    }

    this.setCategoryIndex(categoryIndex);
    this.setItemIndex(itemIndex);
    this.setEmbedded(embedded);
};

/**
* Set the up video player
* @function
*/
FullscreenPage.prototype.setUpVideoPlayer = function () {
    var videoPlayerController = this.getVideoPlayerController();
    var videoControlsController = this.getVideoControlsController();
    var videoDataController = this.getVideoDataController();
    var videoData = videoDataController.getVideoData(this.getCategoryIndex())[this.getItemIndex()];
    videoPlayerController.setVideoUrl(videoData.src);
    videoControlsController.reset();
};

/**
* A callback for the handle video controls events
* @function
* @param {String} action An action defined in the VideoControlsController
*/
FullscreenPage.prototype.onHandleVideoControlEventCommand = function (action) {
    var videoPlayer = this.getVideoPlayerController();
    if(!videoPlayer) {
        return;
    }

    if(action == ACTION_PLAY || action == ACTION_PAUSE) {
        videoPlayer.playPause();
    } else if(action == ACTION_REWIND) {
        videoPlayer.rewind();
    } else if(action == ACTION_FF) {
        videoPlayer.fastForward();
    } else if(action == ACTION_PREV) {
        var prevItemIndex = this.getItemIndex() - 1;
        if(prevItemIndex < 0) {
            prevItemIndex = this.getVideoDataController().getVideoData(this.getCategoryIndex()).length - 1;
        }
        this.setItemIndex(prevItemIndex);
        this.setUpVideoPlayer();
        //location.assign('./fullscreen.html?category='+this.getCategoryIndex()+'&item='+prevItemIndex);
    } else if(action == ACTION_NEXT) {
        var nextItemIndex = this.getItemIndex() + 1;
        if(nextItemIndex >= this.getVideoDataController().getVideoData(this.getCategoryIndex()).length) {
            nextItemIndex = 0;
        }
        this.setItemIndex(nextItemIndex);
        this.setUpVideoPlayer();
        //location.assign('./fullscreen.html?category='+this.getCategoryIndex()+'&item='+nextItemIndex);
    }
};

/**
* Method to initialise all the controllers used by this class
* @private
* @function
*/
FullscreenPage.prototype.initControllers = function () {
    var videoControlsController = this.getVideoControlsController();
    videoControlsController.setOnVideoCommandCallback(this.getOnVideoControlEventCallback());

    var videoPlayerController = this.getVideoPlayerController();
    videoPlayerController.setPlayerCallback(this.getOnVideoPlayerEventCallback());
};

/**
* A callback method for a video playback event
* @function
* @param {String} type The type of event defined in VideoPlayerController
* @param {String} data Data relevant to the event type
*/
FullscreenPage.prototype.onVideoPlayerEvent = function (type, data) {
    if(type == VIDEO_EVENT_STATE_CHANGE) {
        this.getVideoControlsController().setState(data);
    } else if(type == VIDEO_EVENT_PROGRESS_UPDATE) {
        this.getVideoControlsController().setLoadedTime(data);
    } else if(type == VIDEO_EVENT_TIME_UPDATE) {
        this.getVideoControlsController().setElapsedTime(data);
    } else if(type == VIDEO_EVENT_DURATION_CHANGE) {
        this.getVideoControlsController().setDuration(data);
    } else if(type == VIDEO_EVENT_LOADED) {
        this.getVideoControlsController().setDuration(data);
    } else if(type == VIDEO_EVENT_MOUSE_MOVED) {
        // NOOP
    }
};

/**
* Set the initial view to receive focus
* @function
*/
FullscreenPage.prototype.initialiseFocus = function () {
  var focusController = this.getFocusController();
  focusController.handleFocusChangeToItem(0);
};

/**
* Handle URIs from the Native application to JS
* @function
* @param {Stirng} uri The Uri passed from native to the Javascript
*/
FullscreenPage.prototype.handleUri = function (uri) {
    if(uri.indexOf(this.URI_PREFIX) !== 0) {
        // Invalid uri for us to handle
        return;
    }

    uri = uri.substring(this.URI_PREFIX.length, uri.length);

    var uriParts = uri.split(";");
    if(!uriParts || !uriParts.length || uriParts.length === 0) {
        return;
    }

    var action = uriParts[0];
    if(action == 'DATA_DURATION') {
        this.getVideoControlsController().setDuration(uriParts[1]);
    } else if(action == 'DATA_CURRENT_POSITION') {
        this.getVideoControlsController().setElapsedTime(uriParts[1]);
    } else if(action == 'DATA_BUFFERING_PERCENT') {
        this.getVideoControlsController().setLoadedPercentage(uriParts[1]);
    } else if(action == 'DATA_PLAY_STATE') {
        var state = uriParts[1].toLowerCase();
        if(state == 'playing') {
            this.onVideoPlayerEvent(VIDEO_EVENT_STATE_CHANGE, STATE_PLAYING);
        } else {
            this.onVideoPlayerEvent(VIDEO_EVENT_STATE_CHANGE, STATE_PAUSED);
        }

    }
};

/**
* Set up key handling if the view is embedded (i.e. in Android)
* @function
*/
FullscreenPage.prototype.setUpKeyHandling = function () {
    if(this.isEmbedded()) {
      // We want the native app to access this
      window.androidKeyHandler = new AndroidKeyHandler(this.getFocusController());
  }
};

var fullscreenPage;

$(document).ready(function() {
    if(fullscreenPage !== undefined) {
        return;
    }

    var focusController = new FocusController();

    fullscreenPage = new FullscreenPage(new VideoDataController(), focusController);
    fullscreenPage.setUpPageState();

    var videoPlayerController;
    if(fullscreenPage.isEmbedded()) {
        videoPlayerController = new NativeVideoPlayerController();
        window.fullscreenPage = fullscreenPage;
    } else {
        videoPlayerController = new WebVideoPlayerController('video-container');
    }

    fullscreenPage.setUpKeyHandling();

    fullscreenPage.setVideoPlayerController(videoPlayerController);
    fullscreenPage.setVideoControlsController(new VideoControlsController('controls-container', focusController));
    fullscreenPage.initControllers();
    fullscreenPage.setUpVideoPlayer();

    fullscreenPage.initialiseFocus();

    $(document.body).css('visibility', 'visible');
});
