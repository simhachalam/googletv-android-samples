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

package com.google.android.gtv.nativewebsample.net;

import android.util.Log;

/**
 * This class is a helper method to regularly call a listener method which is
 * then used to perform a web UI update. Given the frequency of VideoView
 * updates, this reduces the stress on the WebView
 */
public class JSUpdateRunnable implements Runnable {

    private int mUpdatePeriodMilliSecs;
    private JSUpdateListener mListener;
    private boolean mKill;

    /**
     * Determines the frequency of updates and the listener to call the update
     * events on
     * 
     * @param updatePeriodMilliSeconds
     * @param listener
     */
    public JSUpdateRunnable(int updatePeriodMilliSeconds, JSUpdateListener listener) {
        mUpdatePeriodMilliSecs = updatePeriodMilliSeconds;
        mListener = listener;
    }

    public void run() {
        mKill = false;
        while (!mKill) {
            try {
                Thread.sleep(mUpdatePeriodMilliSecs);
            } catch (InterruptedException e) {
                // NOOP
            }

            mListener.onPerformUpdate();
        }
    }

    /**
     * When updates are no longer required this method will end the update loop
     */
    public void killThread() {
        mKill = true;
    }

    /**
     * This interface just outlines the update callback
     */
    public interface JSUpdateListener {
        public void onPerformUpdate();
    }
}
