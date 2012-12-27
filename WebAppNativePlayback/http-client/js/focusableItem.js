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
 * This class is intended to be inherited by all classes which are going to
 * handle focusing on elements
 *
 * @constructor
 * @param {DOMElement} domElement The dom element to assosciate with this
 * focusable item
 */
 function FocusableItem(domElement) {
    var element = domElement;
    var focusState = false;

    /**
    * Get the focusable DOM element
    */
    this.getElement = function () {
        return element;
    };

    /**
    * Set the focus state of this item
    * @param {Boolean} isFocused
    */
    this.setFocusState = function (focus) {
        focusState = focus;
        this.onFocusStateChange(focus);
    };
}

/**
* This is a callback method when the focus state has changed
* @function
* @param {Boolean} isFocused
*/
FocusableItem.prototype.onFocusStateChange = function (isFocused) {
    // NOOP
};

/**
* Callback for when the item is clicked
* @function
*/
FocusableItem.prototype.onItemClick = function FocusableItem_onItemClick() {
    // NOOP
};
