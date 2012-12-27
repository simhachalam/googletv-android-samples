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
 * The VideoControlsController handles the UI for the Video controls and gets
 * information from a GenericVideoPlayerController
 *
 * @constructor
 * @param {int} containerId Container Id for the controls to be placed
 * @param {FocusController} focusController Focus Controller for the buttons
 */
function VideoControlsController(contId, fController) {
    var containerId = contId;
    var videoCommandCallback = null;
    var focusableItems = [];
    var focusController = fController;
    var loadedPercent = 0;
    var duration = 0;
    var elapsedTime = 0;

    this.CONTROL_CONTAINER_CLASS = 'video-command-container';
    this.VIDEO_COMMAND_CLASS = 'video-command';
    this.PROGRESS_BAR_ID = 'progress-bar';
    this.PROGRESS_BAR_CLASS = 'progress-bar';
    this.PROGRESS_TIME_CLASS = 'progress-time';
    this.PROGRESS_ELAPSED_TIME_CLASS = 'progress-elapsed-time';
    this.ELAPSED_TIME_FS_CLASS = 'elapsed-time-fs';
    this.ELAPSED_TIME_ID = 'elapsed-time';
    this.ELAPSED_TIME_CLASS = 'elapsed-time';
    this.PROGRESS_BAR_FS_CLASS = 'progressbar-fs';
    this.PROGRESS_BAR_BG_CLASS = 'progress-bar-back';
    this.PROGRESS_PLAY_CLASS = 'progress-play-progress';
    this.PROGRESS_TIME_FS_CLASS = 'progress-time-fs';
    this.PROGRESS_LOAD_CLASS = 'progress-load-progress';
    this.LOAD_TIME_FS_CLASS = 'load-time-fs';
    this.PROGRESS_TIME_CLASS = 'progress-time';
    this.PROGRESS_DURATION_CLASS = 'progress-duration';
    this.DURATION_FS_CLASS = 'duration-fs';
    this.DURATION_TIME_ID = 'duration-time';
    this.DURATION_TIME_CLASS = 'duration-time';
    this.PLAY_PAUSE_BUTTON_CLASS = 'play-pause-fs';
    this.FAST_FORWARD_BUTTON_CLASS = 'fast-forward-fs';
    this.REWIND_BUTTON_CLASS = 'rewind-fs';
    this.PREVIOUS_BUTTON_CLASS = 'previous-fs';
    this.NEXT_BUTTON_CLASS = 'next-fs';

    /**
    * Get the container Id
    */
    this.getContainerId = function () {
        return containerId;
    };

    /**
    * This method will handle calling the correct callback for a video command
    * @param {String} action
    */
    this.onVideoCommand = function (action) {
        var callback = this.getOnVideoCommandClickCallback();
        if(callback) {
            callback(action);
        }
    };

    /**
    * Add a focusable item to the focus controller
    * @param {FocusableItem} focusableItem
    */
    this.addFocusableItem = function (focusableItem) {
        focusableItems.push(focusableItem);
        focusController.addFocusableItem(focusableItem);
    };

    /**
    * Remove all the focusable items from the focus controller
    */
    this.removeFocusableItems = function () {
        for(var i = 0; i < focusableItems.length; i++) {
            focusController.removeFocusableItem(focusableItems[i]);
        }
    };

    /**
    * Set the callback method for video commands
    * @param {function} callback
    */
    this.setOnVideoCommandCallback = function (callback) {
        this.videoCommandCallback = callback;
    };

    /**
    *Get the video commands callback
    */
    this.getOnVideoCommandClickCallback = function () {
        return this.videoCommandCallback;
    };

    /**
    * Set the state of the controller (Playing / Paused / Stopped)
    * @param {String} state
    */
    this.setState = function (state) {
        var image;
        if(state == STATE_PLAYING) {
            image = $($('#'+this.PLAY_PAUSE_BUTTON_CLASS+' img')[0]);
            image.attr('src', '../images/bt-pause.png');
        } else if(state == STATE_PAUSED || state == STATE_STOPPED) {
            image = $($('#'+this.PLAY_PAUSE_BUTTON_CLASS+' img')[0]);
            image.attr('src', '../images/bt-playFS.png');
        }
    };

    /**
    * Get the duration of the video controls
    */
    this.getDuration = function () {
        return this.duration;
    };

    /**
    * Set the duration of the controls
    * @param {int} seconds
    */
    this.setDuration = function (seconds) {
        this.duration = seconds;
        $('#'+this.DURATION_TIME_ID).html(formatSeconds(seconds));
        this.updateProgressBar();
    };

    /**
    * Set the elapsed time of playback
    * @param {int} seconds
    */
    this.setElapsedTime = function (seconds) {
        this.elapsedTime = seconds;
        $('#'+this.ELAPSED_TIME_ID).html(formatSeconds(seconds));

        this.updateProgressBar();
    };

    /**
    * Get the elapsed time of playback
    */
    this.getElapsedTime = function () {
        return this.elapsedTime;
    };

    /**
    * Update the progress bar UI
    */
    this.updateProgressBar = function () {
        var progressPercent = Math.round(this.getElapsedTime() * 100 / this.getDuration());

        this.updateBufferedPercentage(this.getLoadedPercentage());
        $('.'+this.PROGRESS_TIME_FS_CLASS).css('width', progressPercent+'%');
    };

    /**
    * Get the loaded percent
    */
    this.getLoadedPercentage = function () {
        return loadedPercent;
    };

    /**
    * Set the loaded time of the video
    * @param {int} seconds
    */
    this.setLoadedTime = function (seconds) {
        var percent = Math.round(seconds * 100 / this.getDuration());
        this.setLoadedPercentage(percent);
    };

    /**
    * Set the loaded percentage
    * @param {int} percent
    */
    this.setLoadedPercentage = function (percent) {
        loadedPercent = percent;
        this.updateProgressBar();
    };

    /**
    * Update the buffered percentage
    * @param {int} percent
    */
    this.updateBufferedPercentage = function (percent) {
        $('.'+this.LOAD_TIME_FS_CLASS).css('width', percent + '%');
    };

    /**
    * Reset the controls state
    */
    this.reset = function () {
        this.setState(STATE_STOPPED);
        this.setElapsedTime(0);
        this.setLoadedTime(0);
        this.setDuration(0);
    };

    appendHTMLMarkup.bind(this)();

    /**
    * Add the HTML markup to the container Id
    * @private
    */
    function appendHTMLMarkup() {
        if(!this.getContainerId()) {
            // No ContainerId
            console.log("VideoControlsController: No Contianer ID");
            return;
        }

        var controlsContainer = $('#'+this.getContainerId());

        // First by adding play, pause, rewind etc
        var videoCommands = getVideoCommands.bind(this)();
        var focusableItem;
        for(var i = 0; i < videoCommands.length; i++) {
            var container = $('<div></div>').addClass(this.CONTROL_CONTAINER_CLASS);

            var command = $('<div></div>').addClass(this.VIDEO_COMMAND_CLASS);
            command.attr('id', videoCommands[i].id);

            // Make command focusable here
            focusableItem = new VideoCommandFocusableItem(command, videoCommands[i].action);
            focusableItem.setOnItemClickCallback(this.onVideoCommand.bind(this));
            this.addFocusableItem(focusableItem);

            var commandImg = $('<img />').attr('src', videoCommands[i].url);

            command.append(commandImg);
            container.append(command);
            controlsContainer.append(container);
        }

        // Add progress bar
        var progressBar = $("<div></div>").attr('id', this.PROGRESS_BAR_ID).addClass(this.PROGRESS_BAR_CLASS);

        var elapsedTime = $('<div></div>');
        elapsedTime.addClass(this.PROGRESS_TIME_CLASS);
        elapsedTime.addClass(this.PROGRESS_ELAPSED_TIME_CLASS);
        elapsedTime.addClass(this.ELAPSED_TIME_FS_CLASS);

        var elapsedSpan = $('<span></span>').attr('id', this.ELAPSED_TIME_ID).addClass(this.ELAPSED_TIME_CLASS);
        elapsedTime.append(elapsedSpan);

        progressBar.append(elapsedTime);

        var videoTimeline = $('<div></div>').addClass(this.PROGRESS_BAR_FS_CLASS);
        var timelineBack = $('<div></div>').addClass(this.PROGRESS_BAR_BG_CLASS);

        var progressTime = $('<div></div>').addClass(this.PROGRESS_PLAY_CLASS);
        progressTime.addClass(this.PROGRESS_TIME_FS_CLASS);
        timelineBack.append(progressTime);

        var loadTime = $('<div</div>').addClass(this.PROGRESS_LOAD_CLASS);
        loadTime.addClass(this.LOAD_TIME_FS_CLASS);
        timelineBack.append(loadTime);

        videoTimeline.append(timelineBack);

        progressBar.append(videoTimeline);

        var durationTime = $('<div></div>');
        durationTime.addClass(this.PROGRESS_TIME_CLASS);
        durationTime.addClass(this.PROGRESS_DURATION_CLASS);
        durationTime.addClass(this.DURATION_FS_CLASS);

        var durationSpan = $('<span></span>').attr('id', this.DURATION_TIME_ID).addClass(this.DURATION_TIME_CLASS);
        durationTime.append(durationSpan);

        progressBar.append(durationTime);

        controlsContainer.append(progressBar);
    }

    /**
    * Get an array of video commands for the video playback
    * @private
    */
    function getVideoCommands() {
        return [
            getVideoCommand(this.PREVIOUS_BUTTON_CLASS, '../images/bt-previousFS.png', ACTION_PREV),
            getVideoCommand(this.REWIND_BUTTON_CLASS, '../images/bt-rewFS.png', ACTION_REWIND),
            getVideoCommand(this.PLAY_PAUSE_BUTTON_CLASS, '../images/bt-playFS.png', ACTION_PLAY),
            getVideoCommand(this.FAST_FORWARD_BUTTON_CLASS, '../images/bt-ffFS.png', ACTION_FF),
            getVideoCommand(this.NEXT_BUTTON_CLASS, '../images/bt-nextFS.png', ACTION_NEXT)
        ];
    }

    /**
    * This method creates a video command object
    * @private
    * @param {String} idString The class to give to the button
    * @param {String} imgUrl Button image url
    * @param {String} action The action related to the button
    */
    function getVideoCommand(idString, imgUrl, action) {
        return {
            id: idString,
            url: imgUrl,
            action: action
        };
    }

    /**
    * Format the number of seconds to a string
    * @private
    * @param {int} seconds
    */
    function formatSeconds(seconds) {
        var units = (seconds >= 3600) ? 'hours' : 'minutes';
        return formatTime(seconds, units);
    }

    /**
    * Format the number of seconds and unit to a string
    * @private
    * @param {int} seconds
    * @param {String} unit 'hours' or 'minutes'
    */
    function formatTime(seconds, unit) {
        /**
        * Format string to add zeros
        * @private
        */
        function padZero(num) {
            if (num < 10) {
                return '0' + num;
            }
            return num.toString();
        }

        var minutes;
        switch (unit) {
            case 'hours':
                var hours = Math.floor(seconds / 3600);
                minutes = Math.floor(seconds % 3600);
                return padZero(hours) + ':' + formatTime(minutes, 'minutes');
            case 'minutes':
                minutes = Math.floor(seconds / 60);
                seconds = Math.floor(seconds % 60);
                return padZero(minutes) + ':' + formatTime(seconds, 'seconds');
            case 'seconds':
                return padZero(seconds);
          }
          return padZero(seconds);
    }

 }

/**
* Action play
*/
var ACTION_PLAY = "PLAY";
/**
* Action pause
*/
var ACTION_PAUSE = "PAUSE";
/**
* Action rewind
*/
var ACTION_REWIND = "REWIND";
/**
* Action FF
*/
var ACTION_FF = "FF";
/**
* Action prev
*/
var ACTION_PREV = "PREV";
/**
* Action next
*/
var ACTION_NEXT = "NEXT";
