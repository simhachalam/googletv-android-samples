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

package com.google.android.gtv.nativewebsample.fragments;

import java.io.IOException;
import java.security.PrivateKey;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.logging.LogRecord;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import android.graphics.Color;
import android.os.Handler;
import android.os.Message;
import android.view.SurfaceHolder;
import com.google.android.gtv.nativewebsample.R;
import com.google.android.gtv.nativewebsample.net.JSUpdateRunnable;
import com.google.android.gtv.nativewebsample.net.JSUpdateRunnable.JSUpdateListener;
import com.google.android.gtv.nativewebsample.net.JSToNativeBridge;
import com.google.android.gtv.nativewebsample.net.JSToNativeBridge.JSToNativeListener;

import android.app.Fragment;
import android.media.MediaPlayer;
import android.media.MediaPlayer.OnBufferingUpdateListener;
import android.media.MediaPlayer.OnPreparedListener;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ProgressBar;
import android.widget.Toast;
import android.widget.VideoView;

/**
 * This fragment handles the VideoView behind the WebView
 */
public class WebViewFragment extends Fragment implements JSUpdateListener {

    private static final String TAG = "WebSample";

    private static final int WEBVIEW_UPDATE_PERIOD_MILLIS = 900;

    private static final int MSG_LOAD_WEBVIEW_ACTION = 0;

    private static final String KEY_LOAD_URL_STRING = "com.google.android.gtv.nativewebsample.KEY_LOAD_URL_STRING";

    private MediaPlayer mMediaPlayer;
    private WebView mWebView;
    private VideoView mVideoView;
    private JSToNativeBridge mJSToNativeBridge;
    private boolean mVideoInPreparedState;
    private boolean mAutoPlayVideo;
    private JSUpdateRunnable mUpdateRunnable;
    private ExecutorService mThreadPool;
    private ProgressBar mProgressBar;

    // TODO: This should be a weak reference to avoid memory leak
    private Handler mHandler;
    private String mUrlOfLoadingVideoPage;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        mVideoInPreparedState = false;
        mAutoPlayVideo = false;
        mThreadPool = Executors.newSingleThreadExecutor();

        mHandler = new Handler() {

            public void handleMessage(Message msg) {
                switch(msg.what) {
                    case MSG_LOAD_WEBVIEW_ACTION:
                        String action = msg.getData().getString(KEY_LOAD_URL_STRING);
                        if(action == null) {
                            return;
                        }
                        mWebView.loadUrl(action);
                        break;
                }
            }

        };
    }

    /**
     * When creating the view we define an overrideurl to ensure that the the
     * WebView loads all urls rather then open the Chrome browser. We also
     * append an embedded parameter as this changes the behaviour of the
     * javascript (enables specific features for Android).
     */
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.fragment_webview, container, false);

        mWebView = (WebView) rootView.findViewById(R.id.webview_fragment_webview);
        mVideoView = (VideoView) rootView.findViewById(R.id.webview_fragment_videoview);
        mProgressBar = (ProgressBar) rootView.findViewById(R.id.webview_fragment_progressbar);

        mWebView.getSettings().setJavaScriptEnabled(true);
        mWebView.setWebChromeClient(new WebChromeClient() {
            public void onProgressChanged(WebView view, int progress) {
                // The progress meter will automatically disappear when we reach
                // 100%
                if (progress == 100) {
                    mProgressBar.setVisibility(View.INVISIBLE);
                } else if (mProgressBar.getVisibility() != View.VISIBLE) {
                    mProgressBar.setVisibility(View.VISIBLE);
                }
            }
        });

        mWebView.setWebViewClient(new WebViewClient() {

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                Pattern pattern = Pattern.compile(".*/(.*)\\?(.*)");
                Matcher urlMatcher = pattern.matcher(url);
                if (urlMatcher.matches()) {
                    url += "&embedded=true";
                } else {
                    url += "?embedded=true";
                }

                view.loadUrl(url);

                // We need to ensure the background is transparent
                view.setBackgroundColor(0x00000000);

                return true;
            }

            public void onReceivedError(WebView view, int errorCode, String description,
                    String failingUrl) {
                Toast.makeText(getActivity(), description, Toast.LENGTH_SHORT).show();
                mProgressBar.setVisibility(View.INVISIBLE);
            }
        });

        mJSToNativeBridge = new JSToNativeBridge(new VideoActionListener());

        /**
         * AppInterface is the variable that will be accessible in the
         * javascript and be able to call native methods
         */
        mWebView.addJavascriptInterface(mJSToNativeBridge, "AppInterface");

        mWebView.loadUrl(getString(R.string.init_url) + "?embedded=true");

        // We need to ensure the background is transparent
        mWebView.setBackgroundColor(0x00000000);

        // This is needed otherwise the video view will receive focus
        mWebView.requestFocus();

        mMediaPlayer = new MediaPlayer();
        mMediaPlayer.setOnPreparedListener(new OnPreparedListener() {

            public void onPrepared(MediaPlayer mp) {
                if(mUrlOfLoadingVideoPage == null || !mUrlOfLoadingVideoPage.equals(mWebView.getUrl())) {
                    return;
                }

                mp.setDisplay(mVideoView.getHolder());
                handleWebAction("DATA_DURATION", new String[]{
                        Integer.toString(mMediaPlayer.getDuration() / 1000)
                });
                updateCurrentPosition();
                mVideoInPreparedState = true;

                if (mAutoPlayVideo) {
                    playVideo();
                }
                mAutoPlayVideo = false;
            }
        });
        mMediaPlayer.setOnBufferingUpdateListener(new OnBufferingUpdateListener() {

            public void onBufferingUpdate(MediaPlayer mp, int percent) {
                if (mVideoInPreparedState == false) {
                    return;
                }
                handleWebAction("DATA_BUFFERING_PERCENT", new String[] {
                        Integer.toString(percent)
                });
            }
        });

        return rootView;
    }

    @Override
    public void onResume() {
        super.onResume();

        refresh();
    }

    @Override
    public void onPause() {
        super.onPause();

        mVideoInPreparedState = false;

        if (mUpdateRunnable != null) {
            mUpdateRunnable.killThread();
            mUpdateRunnable = null;
        }

        mMediaPlayer.release();
    }

    /**
     * This is a helper method which resets the web UI and the native UI
     */
    private void resetWebPage() {
        updateCurrentPosition();
        handleWebAction("DATA_DURATION", new String[] {
                Integer.toString(0)
        });
        updatePlayState();
    }

    /**
     * Updates the current positions of the Video playback
     */
    private void updateCurrentPosition() {
        int currentPosition = 0;
        if (mVideoInPreparedState != false) {
            currentPosition = mMediaPlayer.getCurrentPosition() / 1000;
        }
        handleWebAction("DATA_CURRENT_POSITION", new String[] {
                Integer.toString(currentPosition)
        });
    }

    /**
     * This updates the state of the play button
     */
    private void updatePlayState() {
        String state = "PAUSED";
        if (mMediaPlayer.isPlaying()) {
            state = "PLAYING";
        }
        handleWebAction("DATA_PLAY_STATE", new String[] {
                state
        });
    }

    /**
     * This gives access to the WebView history stack
     * 
     * @return Whether the stack can go back
     */
    public boolean canGoBack() {
        return mWebView.canGoBack();
    }

    /**
     * Handles going back in the web view and resetings the video playback
     */
    public void goBack() {
        mWebView.goBack();
        if(mMediaPlayer.isPlaying()) {
            mMediaPlayer.reset();
        }

        if(!mMediaPlayer.isPlaying() && mUpdateRunnable != null) {
            mUpdateRunnable.killThread();
            mUpdateRunnable = null;
        }
    }

    /**
     * Refresh the WebView
     */
    public void refresh() {
        if (mWebView != null) {
            mWebView.reload();
        }
    }

    /**
     * Given a key code, this method will pass it into the web view to handle
     * accordingly
     * 
     * @param keycode Native Android KeyCode
     */
    public void handleKeyInjection(int keycode) {
        String jsSend = "javascript:androidKeyHandler.handleUri('nativewebsample://KEY_EVENT;"
                + keycode + ";');";
        loadJavascriptAction(jsSend);
    }

    /**
     * This method will take an action string and an array of string parameters
     * and pass it to the javascript
     * 
     * @param action
     * @param data
     */
    private void handleWebAction(String action, String[] data) {
        String jsSend = "javascript:fullscreenPage.handleUri('nativewebsample://" + action + ";";
        for (String d : data) {
            jsSend += d + ";";
        }
        jsSend += "');";

        loadJavascriptAction(jsSend);
    }

    /**
     * This method will take an action string and ensure it's passed to the Webview
     * on the native UI thread
     *
     * @param action
     */
    private void loadJavascriptAction(String action) {
        Message msg = Message.obtain();
        msg.what = MSG_LOAD_WEBVIEW_ACTION;

        Bundle msgData = new Bundle();
        msgData.putString(KEY_LOAD_URL_STRING, action);
        msg.setData(msgData);

        mHandler.sendMessage(msg);
    }

    /**
     * This is a helper method which updates each of the web UI components
     */
    public void onPerformUpdate() {
        if (!mVideoInPreparedState) {
            return;
        }

        updateCurrentPosition();
        updatePlayState();
    }

    /**
     * Handles starting the video playback
     */
    private void playVideo() {
        Log.v(TAG, "playVideo()");
        if (mMediaPlayer.isPlaying() || mVideoInPreparedState == false) {
            return;
        }

        // Ensure we are updating the web UI reguarly
        if (mUpdateRunnable == null) {
            mUpdateRunnable = new JSUpdateRunnable(WEBVIEW_UPDATE_PERIOD_MILLIS,
                    WebViewFragment.this);
            mThreadPool.execute(mUpdateRunnable);
        }
        Log.v(TAG, "playVideo() start");
        mMediaPlayer.start();
    }

    /**
     * Pause the video back and ensure the MediaPlay state isn't disrupted
     */
    private void pauseVideo() {
        if (!mMediaPlayer.isPlaying() || mVideoInPreparedState == false) {
            return;
        }

        mMediaPlayer.pause();
    }

    /**
     * VideoActionListener is an implementation of the JSToNativeListener All
     * methods from Javascript are handled in this class
     */
    private class VideoActionListener implements JSToNativeListener {

        // Load the video with the supplied URL and autoplay it if needed
        public void loadVideo(String url, boolean autoPlay) {
            Log.v(TAG, "loadVideo() url = "+url+" autoPlay = "+autoPlay);

            mVideoInPreparedState = false;
            mAutoPlayVideo = autoPlay;

            if (url == null) {
                return;
            }

            if (mUpdateRunnable != null) {
                mUpdateRunnable.killThread();
                mUpdateRunnable = null;
            }

            try {
                mMediaPlayer.reset();
                resetWebPage();

                mUrlOfLoadingVideoPage = mWebView.getUrl();

                mMediaPlayer.setDataSource(url);
                mMediaPlayer.prepareAsync();
            } catch (IllegalArgumentException e) {
                Log.e(TAG, "WebViewFragment: IllegalArgumentException");
            } catch (IllegalStateException e) {
                Log.e(TAG, "WebViewFragment: IllegalStateException");
            } catch (IOException e) {
                Log.e(TAG, "WebViewFragment: IOException");
            }

        }

        // Toggle the play / pause video
        public void playPauseVideo() {
            if (mMediaPlayer.isPlaying()) {
                pauseVideo();
            } else {
                playVideo();
            }
        }

        // Fast forward and by how far from media player
        public void fastForwardVideo(int skipMilliseconds) {
            mMediaPlayer.seekTo(mMediaPlayer.getCurrentPosition() + skipMilliseconds);
        }

        // Rewind by how far from the media player
        public void rewindVideo(int skipMilliseconds) {
            mMediaPlayer.seekTo(mMediaPlayer.getCurrentPosition() - skipMilliseconds);
        }
    }
}
