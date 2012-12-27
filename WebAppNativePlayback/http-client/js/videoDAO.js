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
 * This class creates a set of video data to populate the UI
 * This creates random data for each web page.
 *
 * @constructor
 */
function VideoDAO() {
    var MIN_NUMBER_OF_VIDEOS_PER_CATEGORY = 15;
    var MAX_NUMBER_OF_VIDEOS_PER_CATEGORY = 30;

    var categoryData = [{
        name: "Dev Events",
        videos: []
    }, {
        name: "Technology",
        videos: []
    }, {
        name: "Conferences",
        videos: []
    }, {
        name: "Keynotes",
        videos: []
    }, {
        name: "Talks",
        videos: []
    }, {
        name: "Events",
        videos: []
    }];

    var videoData = [
    {
        src:'http://commondatastorage.googleapis.com/gtv_template_assets/' +
            'IO2010-Keynote-day1.mp4',
        title: '2010 Day 1 Keynote',
        desc: 'Moscone Center',
        image: 'images/thumbs/thumb' + getThumbId() + '.jpg'
    },
    {
        src:'http://commondatastorage.googleapis.com/gtv_template_assets/' +
            'IO2010-Keynote-day2-android.mp4',
        title: '2010 Day 2 Keynote',
        desc: 'Moscone Center',
        image: './images/thumbs/thumb' + getThumbId() + '.jpg'
    },
    {
        src:'http://commondatastorage.googleapis.com/gtv_template_assets/' +
            'IO2009-Keynote-day1.mp4',
        title: '2009 Day 1 Keynote',
        desc: 'Moscone Center',
        image: './images/thumbs/thumb' + getThumbId() + '.jpg'
    },
    {
        src:'http://commondatastorage.googleapis.com/gtv_template_assets/' +
            'GDD2010-Highlights.mp4',
        title: '2010 Highlights',
        desc: 'Google Developer Day',
        image: './images/thumbs/thumb' + getThumbId() + '.jpg'
    },
    {
        src:'http://commondatastorage.googleapis.com/gtv_template_assets/' +
            'GDD2010-BR-Keynote.mp4',
        title: '2010 Keynote',
        desc: 'Brazil',
        image: './images/thumbs/thumb' + getThumbId() + '.jpg'
    },
    {
        src:'http://commondatastorage.googleapis.com/gtv_template_assets/' +
            'ChromeFrame.mp4',
        title: 'Using Google Chrome Frame',
        desc: 'Alex Russell',
        image: './images/thumbs/thumb' + getThumbId() + '.jpg'
    },
    {
        src:'http://commondatastorage.googleapis.com/gtv_template_assets/' +
            'CWS-HowTo.mp4',
        title: 'Uploading your App',
        desc: 'Moscone Center',
        image: './images/thumbs/thumb' + getThumbId() + '.jpg'
    },
    {
        src:'http://commondatastorage.googleapis.com/gtv_template_assets/' +
            'CWS-GettingStarted.mp4',
        title: 'Getting Started with Apps for the Chrome Web Store',
        desc: 'Arne Roomann-Kurrik',
        image: './images/thumbs/thumb' + getThumbId() + '.jpg'
    },
    {
        src:'http://commondatastorage.googleapis.com/gtv_template_assets/' +
            'Chrome-Accessibility.mp4',
        title: 'Google Chrome Extensions and Accessibility',
        desc: 'Rachel Shearer',
        image: './images/thumbs/thumb' + getThumbId() + '.jpg'
    },
    {
        src:'http://commondatastorage.googleapis.com/gtv_template_assets/' +
            'CF1-AppsMarketplace-Part1.mp4',
        title: 'Campfire Part 1',
        desc: 'Moscone Center',
        image: './images/thumbs/thumb' + getThumbId() + '.jpg'
    },
    {
        src:'http://commondatastorage.googleapis.com/gtv_template_assets/' +
            'CF1-AppsMarketplace-Part2.mp4',
        title: 'Campfire Part 1',
        desc: 'Moscone Center',
        image: './images/thumbs/thumb' + getThumbId() + '.jpg'
    },
    {
        src:'http://commondatastorage.googleapis.com/gtv_template_assets/' +
            'CF1-AppsMarketplace-Part3.mp4',
        title: 'Campfire Part 1',
        desc: 'Moscone Center',
        image: './images/thumbs/thumb' + getThumbId() + '.jpg'
    },
    {
        src:'http://commondatastorage.googleapis.com/gtv_template_assets/' +
            'CF1-AppsMarketplace-Part4.mp4',
        title: 'Campfire Part 1',
        desc: 'Moscone Center',
        image: './images/thumbs/thumb' + getThumbId() + '.jpg'
    },
    {
        src:'http://commondatastorage.googleapis.com/gtv_template_assets/' +
            'CF1-AppsMarketplace-Part5.mp4',
        title: 'Campfire Part 1',
        desc: 'Moscone Center',
        image: './images/thumbs/thumb' + getThumbId() + '.jpg'
    },
    {
        src:'http://commondatastorage.googleapis.com/gtv_template_assets/' +
            'CF1-AppsMarketplace-Part6.mp4',
        title: 'Campfire Part 1',
        desc: 'Moscone Center',
        image: './images/thumbs/thumb' + getThumbId() + '.jpg'
    }
    ];

    var maxNumberOfVideos = (MAX_NUMBER_OF_VIDEOS_PER_CATEGORY - MIN_NUMBER_OF_VIDEOS_PER_CATEGORY);
    for(var i = 0; i < categoryData.length; i++) {
        var numOfVids = getRandom(maxNumberOfVideos) + MIN_NUMBER_OF_VIDEOS_PER_CATEGORY;
        for(var j = 0; j < numOfVids; j++) {
            categoryData[i].videos.push(videoData[getRandom(videoData.length)]);
        }
    }

    /**
    * This method returns the array of category data
    */
    this.getCategoryData = function () {
        return categoryData;
    };

    /**
    * This method returns a value between 0 and the max value
    * @private
    * @param {int} max The max random value
    */
    function getRandom(max) {
        return Math.floor(Math.random() * max);
    }

    /**
    * This method returns a thumbId
    * @private
    */
    function getThumbId() {
        var max = 14;
        var num = getRandom(max);
        if (num === 0) {
            num = 1;
        }
        if (num < 10) {
            num = '0' + num;
        }
        return num.toString();
    }
};

/**
 * Returns an array of video category objects
 */
 VideoDAO.prototype.getVideoCategories = function() {
    /**
    * Helper method to create a category object
    * @private
    * @param {String} title The title of the category
    */
    function createVideoCategory(title) {
        return {
            title: title
        };
    }

     var categoryData = this.getCategoryData();
     var output = [];
     for(var i = 0; i < categoryData.length; i++) {
        output.push(createVideoCategory(categoryData[i].name));
    }
    return output;
};

/**
* Returns the array of videos for a given categoryId
* @param {int} categoryId
*/
VideoDAO.prototype.getVideoData = function(categoryId) {
  return this.getCategoryData()[categoryId].videos;
}


