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
 * This controller will take care of determining where the focus moves when
 * a key press or mouse movement has occurred
 *
 * @constructor
 */
 function FocusController() {
    var focusableItems = [];
    var moving = false;
    var currentlyFocusedItem = null;

    /**
    * Check whether a focusable item is already in the item array
    * @param {FocusableItem} item Check to see if the FocusableItem is already
    * in the FocusController
    */
    this.isFocusableItem = function (item) {
        for(var i = 0; i < focusableItems.length; i++) {
            if(focusableItems[i] == item) {
                return true;
            }
        }
        return false;
    };

    /**
    * Push a focusable item onto item array
    * @private
    * @param {FocusableItem} item
    */
    this.pushFocusableItem = function (item) {
        focusableItems.push(item);
    };

    /**
    * Remove a focusable item from the controller
    * @param {FocusableItem} item The item to remove
    */
    this.removeFocusableItem = function (item) {
        for(var i = 0; i < focusableItems.length; i++) {
            if(focusableItems[i] == item) {
                focusableItems.splice(i, 1);
                return true;
            }
        }
        return false;
    };

    /**
    * Get the number of focusable items in the controller
    */
    this.getFocusableItemCount = function () {
        return focusableItems.length;
    };

    /**
    * Get a focusable item at a particular index in the array
    * @param {int} index
    */
    this.getFocusableItem = function (index) {
        if(index >= focusableItems.length) {
            return null;
        }

        return focusableItems[index];
    };

    /**
    * Get the currently focused FocusableItem
    */
    this.getCurrentlyFocusedItem = function () {
        return currentlyFocusedItem;
    };

    /**
    * Is the focus currently moving
    */
    this.isMoving = function () {
        return moving;
    };

    /**
    * This method performs a change of focus to the item index
    * @param {int} itemIndex
    */
    this.handleFocusChangeToItem = function (itemIndex) {
        if(currentlyFocusedItem) {
            currentlyFocusedItem.setFocusState(false);
        }

        var focusableItem = this.getFocusableItem(itemIndex);
        focusableItem.setFocusState(true);

        currentlyFocusedItem = focusableItem;
    };

    /**
    * This will take a direction vector and move the focus to the most
    * appropriate item or make no change if there are no items to move to
    * @param {array} direction A direction vector [x, y]
    */
    this.moveFocus = function (direction) {
        // We need an item to move down from
        // TODO: Should initialise focus if not initialised
        if(!currentlyFocusedItem) {
            return;
        }

        var minItemDistance;
        var newItem;
        var minItem;
        var minItemIndex;
        for(var i = 0; i < focusableItems.length; i++) {
            newItem = focusableItems[i];
            if(newItem == currentlyFocusedItem) {
                continue;
            }

            var itemDistance = calculateElementDistance(currentlyFocusedItem, newItem, direction);
            if(itemDistance >= 0 && (minItemDistance === undefined ||
                itemDistance < minItemDistance)) {
                minItemDistance = itemDistance;
                minItem = newItem;
                minItemIndex = i;
            }
        }

        if(minItemIndex >= 0) {
            this.handleFocusChangeToItem(minItemIndex);
        }
    };

    // Set up binding to listen for key presses
    $(document).bind('keydown.keycontroller',
        function(e) {
            console.log("focusController -> keyController");
            this.onKeyDown(e);
        }.bind(this)
    );

    /**
    * @private
    */
    function calculateElementDistance(fromFocusableItem, toFocusableItem, direction) {

        var fromElement = fromFocusableItem.getElement();
        var toElement = toFocusableItem.getElement();

        var fromElementOffset = fromElement.offset();
        var fromElementLeft = fromElementOffset.left;
        var fromElementRight = fromElementLeft + fromElement.outerWidth();
        var fromElementTop = fromElementOffset.top;
        var fromElementBottom = fromElementTop + fromElement.outerHeight();
        var fromElementCenterX = fromElementLeft + (fromElement.outerWidth() / 2);
        var fromElementCenterY = fromElementTop + (fromElement.outerHeight() / 2);

        var toElementOffset = toElement.offset();
        var toElementLeft = toElementOffset.left;
        var toElementRight = toElementLeft + toElement.outerWidth();
        var toElementTop = toElementOffset.top;
        var toElementBottom = toElementTop + toElement.outerHeight();
        var toElementCenterX = toElementLeft + (toElement.outerWidth() / 2);
        var toElementCenterY = toElementTop + (toElement.outerHeight() / 2);

        var distanceY = null;
        var distanceX = null;
        var toItemDistance = -1;

        if(direction.y === 0) {
            if(direction.x < 0) {
                // Move Left

                // The to element is on the left hand side
                if (toElementRight <= fromElementLeft) {
                    distanceX = fromElementLeft - toElementRight;
                }

                // To element is to left but may overlap?
                if (toElementCenterX <= fromElementLeft) {
                    if (distanceX !== undefined) {
                        distanceX = Math.min(distanceX, fromElementLeft - toElementCenterX);
                    } else {
                        distanceX = fromElementLeft - toElementCenterX;
                    }
                }

                if (toElementRight <= fromElementLeft) {
                    if (distanceX !== undefined) {
                        distanceX = Math.min(distanceX, fromElementLeft - toElementRight);
                    } else {
                        distanceX = fromElementLeft - toElementRight;
                    }
                }
            } else if(direction.x > 0) {
                // Move Right
                if (fromElementRight <= toElementLeft) {
                    distanceX = toElementLeft - fromElementRight;
                }

                if (fromElementRight <= toElementCenterX) {
                    if (distanceX !== undefined) {
                        distanceX = Math.min(distanceX, toElementCenterX - fromElementRight);
                    } else {
                        distanceX = toElementCenterX - fromElementRight;
                    }
                }

                if (fromElementLeft < toElementLeft) {
                    if (distanceX !== undefined) {
                        distanceX = Math.min(distanceX, toElementLeft - fromElementLeft);
                    } else {
                        distanceX = toElementLeft - fromElementLeft;
                    }
                }
            }

            distanceY = Math.min(Math.abs(fromElementCenterY - toElementTop),
               Math.abs(fromElementCenterY - toElementCenterY),
               Math.abs(fromElementCenterY - toElementBottom)) * 2;
        } else if(direction.x === 0) {
            if(direction.y > 0) {
                // Move Up
                if (toElementBottom <= fromElementTop) {
                    distanceY = fromElementTop - toElementBottom;
                }

                if (toElementCenterY <= fromElementTop) {
                    if (distanceY !== undefined) {
                        distanceY = Math.min(distanceY, fromElementTop - toElementCenterY);
                    } else {
                        distanceY = fromElementTop - toElementCenterY;
                    }
                }

                if (toElementBottom <= fromElementTop) {
                    if (distanceY !== undefined) {
                        distanceY = Math.min(distanceY, fromElementTop - toElementBottom);
                    } else {
                        distanceY = fromElementTop - toElementBottom;
                    }
                }
            } else if(direction.y < 0) {
                // Move Down

                // Handle when the view is above the current view
                if (fromElementBottom <= toElementTop) {
                    distanceY = toElementTop - fromElementBottom;
                }

                // If the item overlaps the currebt
                if (fromElementBottom <= toElementCenterY) {
                    if (distanceY !== undefined) {
                        distanceY = Math.min(distanceY, toElementCenterY - fromElementBottom);
                    } else {
                        distanceY = toElementCenterY - fromElementBottom;
                    }
                }

                if (fromElementTop < toElementTop) {
                    if (distanceY !== undefined) {
                        distanceY = Math.min(distanceY, toElementTop - fromElementTop);
                    } else {
                        distanceY = toElementTop - fromElementTop;
                    }
                }
            }

            distanceX = Math.min(Math.abs(fromElementCenterX - toElementLeft),
               Math.abs(fromElementCenterX - toElementCenterX),
               Math.abs(fromElementCenterX - toElementRight)) * 2;
        }

        // If either distance is undefined, the toItem is in the wrong direction,
        // so forget trying to move to it.
        if (distanceX !== null && distanceY !== null) {
            toItemDistance = calcDistance(distanceX, distanceY);
        }

        return toItemDistance;
    }

    /**
    * @private
    */
    function calcDistance(x, y) {
        return Math.floor(Math.sqrt((x * x) + (y * y)));
    }
}

/**
* This method will add a focusable item to the controller
* @function
* @param {FocusableItem} item Focusable item to be handled by this
* FocusController
*/
FocusController.prototype.addFocusableItem = function (item) {
    if(this.isFocusableItem(item)) {
        return;
    }

    var itemIndex = this.getFocusableItemCount();
    this.pushFocusableItem(item);

    // This is essentially the dom element of the focusable item
    var element = item.getElement();
    element.bind('mouseenter.keycontroller', {itemIndex: itemIndex}, function(event) {
        if(this.isMoving()) {
            return;
        }

        var itemIndex = event.data.itemIndex;
        this.handleFocusChangeToItem(itemIndex);

        event.stopPropagation();
    }.bind(this));

    element.bind('click.keycontroller', {itemIndex: itemIndex}, function(event) {
        if(this.isMoving()) {
            return;
        }

        var itemIndex = event.data.itemIndex;
        if(this.getCurrentlyFocusedItem()) {
            this.getCurrentlyFocusedItem().onItemClick();
        }
    }.bind(this));
};

/**
* On a key press this method will handle moving the focus
* @function
* @param {int} event Browser key code
*/
FocusController.prototype.onKeyDown = function (event) {
    switch(event.keyCode) {
        case 9:
            // Tab
            break;
        case 37:
            // Left
            this.moveFocus({x: -1, y: 0});
            break;
        case 38:
            // Up
            this.moveFocus({x: 0, y: 1});
            break;
        case 39:
            // Right
            this.moveFocus({x: 1, y: 0});
            break;
        case 40:
            // Down
            this.moveFocus({x: 0, y: -1});
            break;
        case 13:
            // Enter
            if(this.getCurrentlyFocusedItem()) {
                this.getCurrentlyFocusedItem().onItemClick();
            }
            break;
    }
};
