/*
 * Copyright (C) 2012 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.example.google.tv.usbhost;

import android.app.ListActivity;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.hardware.usb.UsbDevice;
import android.hardware.usb.UsbManager;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ListView;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.List;

/**
 * This Activity lists devices that can be controlled using the USB Host APIs.
 * The actual names for the vendor ID and the product IDs listed for a USB
 * device, can be looked up at http://www.linux-usb.org/usb.ids.
 */
public class UsbHostActivity extends ListActivity {
    private static final String TAG = "UsbHostActivity";
    private static final String HEX_PREFIX = "0x";

    private static final String ACTION_USB_PERMISSION =
            "android.mtp.MtpClient.action.USB_PERMISSION";

    private UsbManager mUsbManager;
    private Context mContext;
    private UsbDeviceAdapter mAdapter;
    private final static List<UsbDevice> mDevices = new ArrayList<UsbDevice>();
    private PendingIntent mPermissionIntent;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mContext = this;
        mUsbManager = (UsbManager) getSystemService(Context.USB_SERVICE);
        mPermissionIntent = PendingIntent.getBroadcast(
                this, 0, new Intent(ACTION_USB_PERMISSION), 0);
        IntentFilter filter = new IntentFilter();
        filter.addAction(UsbManager.ACTION_USB_DEVICE_ATTACHED);
        filter.addAction(UsbManager.ACTION_USB_DEVICE_DETACHED);
        filter.addAction(ACTION_USB_PERMISSION);
        registerReceiver(mUsbReceiver, filter);
        mAdapter = new UsbDeviceAdapter(this);
        setListAdapter(mAdapter);
        mDevices.clear();
        for (UsbDevice device : mUsbManager.getDeviceList().values()) {
            Log.d(TAG, "Detected device: " + device.toString());
            mDevices.add(device);
        }
        getListView().setFocusable(true);
        getListView().setSelector(getResources().getDrawable(R.drawable.image_background));
        getListView().requestFocus();
    }

    @Override
    protected void onListItemClick(ListView l, View v, int position, long id) {
        super.onListItemClick(l, v, position, id);
        // request permission to communicate with the USB device.
        mUsbManager.requestPermission(mDevices.get(position), mPermissionIntent);

        // Show device details
        Intent intent = new Intent(UsbHostActivity.this, DeviceDetailsActivity.class);
        intent.putExtra(UsbManager.EXTRA_DEVICE, mDevices.get(position));
        startActivity(intent);
    }

    /**
     * Adapter for the ListView of USB devices.
     */
    private static class UsbDeviceAdapter extends BaseAdapter {
        private LayoutInflater mInflater;

        public UsbDeviceAdapter(Context context) {
            // Cache the LayoutInflate to avoid asking for a new one each time.
            mInflater = LayoutInflater.from(context);
        }

        public int getCount() {
            return mDevices.size();
        }

        public Object getItem(int position) {
            return position;
        }

        public long getItemId(int position) {
            return position;
        }

        public View getView(int position, View convertView, ViewGroup parent) {
            convertView = mInflater.inflate(R.layout.list_item, null);
            TextView vendorId = (TextView) convertView.findViewById(R.id.vendorId);
            TextView productId = (TextView) convertView.findViewById(R.id.productId);
            TextView devicePath = (TextView) convertView.findViewById(R.id.devicePath);
            final UsbDevice device = mDevices.get(position);
            vendorId.setText("Vendor Id: " + HEX_PREFIX + Integer.toHexString(
                    device.getVendorId()));
            productId.setText("Product Id: " + HEX_PREFIX + Integer.toHexString(
                    device.getProductId()));
            devicePath.setText("Device Path: " + device.getDeviceName());
            return convertView;
        }
    }

    /**
     * Receives broadcast when a supported USB device is attached, dettached or
     * when a permission to communicate to the device has been granted.
     */
    private final BroadcastReceiver mUsbReceiver = new BroadcastReceiver() {
            @Override
        public void onReceive(Context context, Intent intent) {
            String action = intent.getAction();
            UsbDevice usbDevice = (UsbDevice) intent.getParcelableExtra(UsbManager.EXTRA_DEVICE);
            String deviceName = usbDevice.getDeviceName();

            synchronized (mDevices) {

                if (UsbManager.ACTION_USB_DEVICE_ATTACHED.equals(action)) {
                    if (usbDevice != null) {
                        mDevices.add(usbDevice);
                        mAdapter.notifyDataSetChanged();
                    } else {
                        Log.e(TAG, "USB device is not initialized");
                    }
                } else if (UsbManager.ACTION_USB_DEVICE_DETACHED.equals(action)) {
                    if (usbDevice != null) {
                        mDevices.remove(usbDevice);
                        mAdapter.notifyDataSetChanged();
                    } else {
                        Log.e(TAG, "USB device is not initialized");
                    }
                } else if (ACTION_USB_PERMISSION.equals(action)) {
                    boolean permission = intent.getBooleanExtra(UsbManager.EXTRA_PERMISSION_GRANTED,
                            false);
                    Log.d(TAG, "ACTION_USB_PERMISSION: " + permission);

                }
            }
        }
    };

    @Override
    public void onStop() {
        super.onStop();

    }
}
