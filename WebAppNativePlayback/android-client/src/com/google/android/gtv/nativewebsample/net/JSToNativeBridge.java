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

/**
 * This class will handle any URI's received form the javascript
 */
public class JSToNativeBridge {

    // The URI_PREFIX is used to identify where the native call came from
    private static final String URI_PREFIX = "nativewebsample://";

    private JSToNativeListener mListener;

    /**
     * @param listener Listener methods are called when URI's are received from
     *            JS
     */
    public JSToNativeBridge(JSToNativeListener listener) {
        mListener = listener;
    }

    /**
     * When a uri is received from the javascript, this method ensures the uri
     * is valid and calls the appropriate method to handle the action
     * 
     * @param uri the URI received from the javascript
     */
    public void handleURI(String uri) {
        if (!uri.startsWith(URI_PREFIX)) {
            return;
        }

        uri = uri.substring(URI_PREFIX.length());
        String[] uriParts = uri.split(";");
        if (uriParts.length == 0) {
            return;
        }

        String action = uriParts[0];
        if (action.equals("ACTION_LOAD_VIDEO")) {
            handleLoadAction(uriParts);
        } else if (action.equals("ACTION_PLAY_PAUSE_VIDEO")) {
            mListener.playPauseVideo();
        } else if (action.equals("ACTION_REWIND_VIDEO")) {
            handleRewindAction(uriParts);
        } else if (action.equals("ACTION_FASTFORWARD_VIDEO")) {
            handleFastForwardAction(uriParts);
        }
    }

    /**
     * Handle a load action, ensuring the parameters are valid
     * 
     * @param uriParts
     */
    private void handleLoadAction(String[] uriParts) {
        if (uriParts.length > 3 || uriParts.length < 2) {
            return;
        }

        boolean autoPlay = false;
        if (uriParts.length == 3) {
            String isAutoPlay = uriParts[2];
            if (isAutoPlay.equalsIgnoreCase("true")) {
                autoPlay = true;
            }
        }

        String videoUrl = uriParts[1];
        mListener.loadVideo(videoUrl, autoPlay);
    }

    /**
     * Handle a rewind action, ensuring the parameters are valid
     * 
     * @param uriParts
     */
    private void handleRewindAction(String[] uriParts) {
        if (uriParts.length != 2) {
            return;
        }

        // x1000 to convert to milliseconds
        mListener.rewindVideo(Integer.parseInt(uriParts[1], 10) * 1000);
    }

    /**
     * Handle a fast forward action, ensure the parameters are valid
     * 
     * @param uriParts
     */
    private void handleFastForwardAction(String[] uriParts) {
        if (uriParts.length != 2) {
            return;
        }

        // x1000 to convert to milliseconds
        mListener.fastForwardVideo(Integer.parseInt(uriParts[1], 10) * 1000);
    }

    /**
     * The VideoListener interface is the agreement between the native
     * WebViewFragment and the URI's sent from javascript
     */
    public interface JSToNativeListener {
        public void loadVideo(String url, boolean autoPlay);

        public void fastForwardVideo(int skipMilliseconds);

        public void rewindVideo(int skipMilliseconds);

        public void playPauseVideo();
    }
}
