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

package com.google.android.gtv.nativewebsample;

import com.google.android.gtv.nativewebsample.fragments.WebViewFragment;

import android.app.Activity;
import android.content.pm.ApplicationInfo;
import android.os.Bundle;
import android.view.KeyEvent;

/**
 * This activity performs the following tasks: Instantiates the WebViewFragment,
 * which holds the WebView Overrides key presses which are then passed to the
 * WebView to consume
 */
public class GTVNativeWebSampleActivity extends Activity {

    private WebViewFragment mWebViewFragment;
    private boolean mIsDevelopmentBuild;
    private int[] mOverrideKeyCodes;

    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);

        mWebViewFragment = (WebViewFragment) getFragmentManager().findFragmentById(
                R.id.webview_fragment);
        mIsDevelopmentBuild = ((getApplicationInfo().flags & ApplicationInfo.FLAG_DEBUGGABLE) != 0);

        setUpOverrideKeys();
    }

    /**
     * This method will create an int[] of Android keycodes which are used to
     * determine whether to pass key presses down to the WebView for the web
     * application to handle. If the web app does not handle d-pad key presses,
     * setting the consume_d_pad boolean to false allows the browser to handle
     * the events accordingly. The reason you may want to override the d-pad key
     * press events is because the Android WebView interprets directional key
     * presses as mouse events, making it hard to write your own focus handling
     */
    private void setUpOverrideKeys() {
        if (getResources().getBoolean(R.bool.consume_d_pad)) {
            mOverrideKeyCodes = new int[] {
                    KeyEvent.KEYCODE_DPAD_CENTER,
                    KeyEvent.KEYCODE_DPAD_UP,
                    KeyEvent.KEYCODE_DPAD_LEFT,
                    KeyEvent.KEYCODE_DPAD_DOWN,
                    KeyEvent.KEYCODE_DPAD_RIGHT
            };
        } else {
            mOverrideKeyCodes = new int[] {};
        }
    }

    /**
     * Since we are dealing with a WebApplication we want the back button to
     * step through the WebView history before exiting the app, emulating a
     * native application.
     */
    @Override
    public void onBackPressed() {
        if (mWebViewFragment.canGoBack()) {
            mWebViewFragment.goBack();
            return;
        }

        super.onBackPressed();
    }

    /**
     * This method will check if the key press should be handled by the system
     * or if we have chosen to override it to pass to the WebView. In
     * development builds of the application, the R key is used refresh the page
     * (required to ensure cached versions of the page are not used)
     */
    @Override
    public boolean dispatchKeyEvent(KeyEvent event) {
        if (mIsDevelopmentBuild && event.getKeyCode() == KeyEvent.KEYCODE_R) {
            mWebViewFragment.refresh();
        }

        int eventKeyCode = event.getKeyCode();
        for (int i = 0; i < mOverrideKeyCodes.length; i++) {
            if (eventKeyCode == mOverrideKeyCodes[i]) {
                if (event.getAction() == KeyEvent.ACTION_UP) {
                    mWebViewFragment.handleKeyInjection(eventKeyCode);
                }
                return true;
            }
        }

        return super.dispatchKeyEvent(event);
    }
}
