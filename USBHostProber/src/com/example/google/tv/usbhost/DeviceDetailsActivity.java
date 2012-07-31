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

import android.app.Activity;
import android.content.Intent;
import android.hardware.usb.UsbConstants;
import android.hardware.usb.UsbDevice;
import android.hardware.usb.UsbEndpoint;
import android.hardware.usb.UsbInterface;
import android.hardware.usb.UsbManager;
import android.os.Bundle;
import android.widget.LinearLayout;
import android.widget.LinearLayout.LayoutParams;
import android.widget.TextView;

/**
 * This Activity provides the details of interfaces and endpoints supported by
 * the selected USB device.
 */
public class DeviceDetailsActivity extends Activity {
    private static final String HEX_PREFIX = "0x";

    private static final String LOG_TAG = "ExampleApp";
    private LinearLayout container;
    private UsbDevice device;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Intent intent = getIntent();
        device = (UsbDevice) intent.getParcelableExtra(UsbManager.EXTRA_DEVICE);
        setContentView(R.layout.device_details);
        container = (LinearLayout) findViewById(R.id.container);
        showDeviceDetails();
    }

    /**
     * Creates UI to displays device information.
     */
    private void showDeviceDetails() {
        LinearLayout.LayoutParams layoutParams = new LinearLayout.LayoutParams(
                LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT);

        addTextView("Device id: " + HEX_PREFIX + Integer.toHexString(device.getDeviceId()), 10, 20);
        addTextView("Vendor id: " + HEX_PREFIX + Integer.toHexString(device.getVendorId()), 10, 0);
        addTextView(
                "Product id: " + HEX_PREFIX + Integer.toHexString(device.getProductId()), 10, 0);
        addTextView("Device path: " + device.getDeviceName(), 5, 0);

        addTextView("Device Interfaces", 10, 20);
        for (int i = 0; i < device.getInterfaceCount(); i++) {
            buildInterfaceView(device.getInterface(i));
        }
    }

    /**
     * Creates UI to display USB interface information.
     * 
     * @param intf USB interface
     */
    private void buildInterfaceView(UsbInterface intf) {

        addTextView("Interface id: " + HEX_PREFIX + Integer.toHexString(intf.getId()), 20, 20);

        addTextView("Interface class: " + getClassDescription(intf.getInterfaceClass()), 20, 0);

        addTextView("Interface subclass: " + getSubClassDescription(
                intf.getInterfaceSubclass()), 20, 0);

        addTextView("Interface protocol: " + HEX_PREFIX + Integer.toHexString(
                intf.getId()), 20, 0);

        addTextView("Interface Endpoints", 20, 20);
        for (int i = 0; i < intf.getEndpointCount(); i++) {
            buildEndpointView(intf.getEndpoint(i));
        }
    }

    /**
     * Creates TextView.
     * 
     * @param intf USB interface
     */
    private void addTextView(String text, int leftPadding, int topPadding) {
        LinearLayout.LayoutParams layoutParams = new LinearLayout.LayoutParams(
                LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT);

        TextView view = new TextView(this);
        view.setText(text);
        view.setPadding(leftPadding, topPadding, 0, 0);
        view.setLayoutParams(layoutParams);
        container.addView(view);
    }

    /**
     * Creates UI to display USB endpoint information.
     * 
     * @param ep USB endpoint
     */
    private void buildEndpointView(UsbEndpoint ep) {
        addTextView("Endpoint number: " + HEX_PREFIX + Integer.toHexString(ep.getEndpointNumber()),
                40, 20);

        addTextView("Max Packet Size: " + ep.getMaxPacketSize(), 40, 0);

        addTextView("Endpoint Type: " + getTypeDescription(
                ep.getType()), 40, 0);

        addTextView("Endpoint direction: " + getDirDescription(
                ep.getDirection()), 40, 0);
    }

    /**
     * Resolves USB constants
     * 
     * @param id USB constant
     * @return String description of the contant value.
     */
    private String getClassDescription(int id) {
        switch (id) {
            case UsbConstants.USB_CLASS_APP_SPEC:
                return "Application specific USB class";
            case UsbConstants.USB_CLASS_AUDIO:
                return "USB class for audio devices";
            case UsbConstants.USB_CLASS_CDC_DATA:
                return "USB class for CDC devices (communications device class)";
            case UsbConstants.USB_CLASS_COMM:
                return "USB class for communication devices";
            case UsbConstants.USB_CLASS_CONTENT_SEC:
                return "USB class for content security devices";
            case UsbConstants.USB_CLASS_CSCID:
                return "USB class for content smart card devices";
            case UsbConstants.USB_CLASS_HID:
                return "USB class for human interface devices (HID)";
            case UsbConstants.USB_CLASS_HUB:
                return "USB class for USB hubs";
            case UsbConstants.USB_CLASS_MASS_STORAGE:
                return "USB class for mass storage devices";
            case UsbConstants.USB_CLASS_MISC:
                return "USB class for wireless miscellaneous devices";
            case UsbConstants.USB_CLASS_PER_INTERFACE:
                return "USB Class indicating that the class is determined on a per-interface basis";
            case UsbConstants.USB_CLASS_PHYSICA:
                return "USB class for physical devices";
            case UsbConstants.USB_CLASS_PRINTER:
                return "USB class for printers";
            case UsbConstants.USB_CLASS_STILL_IMAGE:
                return "USB class for still image devices";
            case UsbConstants.USB_CLASS_VENDOR_SPEC:
                return "Vendor specific USB class";
            case UsbConstants.USB_CLASS_VIDEO:
                return "USB class for video devices";
            case UsbConstants.USB_CLASS_WIRELESS_CONTROLLER:
                return "USB class for wireless controller devices";
        }
        return "Unknown";
    }

    /**
     * Resolves USB constants
     * 
     * @param id USB constant
     * @return String description of the contant value.
     */
    private String getDirDescription(int id) {
        switch (id) {
            case UsbConstants.USB_DIR_IN:
                return "IN (device to host)";
            case UsbConstants.USB_DIR_OUT:
                return "OUT (host to device)";
        }
        return "Unknown";
    }

    /**
     * Resolves USB constants
     * 
     * @param id USB constant
     * @return String description of the contant value.
     */
    private String getSubClassDescription(int id) {
        switch (id) {
            case UsbConstants.USB_INTERFACE_SUBCLASS_BOOT:
                return "Boot subclass for HID devices";
            case UsbConstants.USB_SUBCLASS_VENDOR_SPEC:
                return "Vendor specific USB subclass";
        }
        return "Unknown";
    }

    /**
     * Resolves USB constants
     * 
     * @param id USB constant
     * @return String description of the contant value.
     */
    private String getTypeDescription(int id) {
        switch (id) {
            case UsbConstants.USB_ENDPOINT_XFER_BULK:
                return "Bulk endpoint type";
            case UsbConstants.USB_ENDPOINT_XFER_CONTROL:
                return "Control endpoint type (endpoint zero)";
            case UsbConstants.USB_ENDPOINT_XFER_INT:
                return "Interrupt endpoint type";
            case UsbConstants.USB_ENDPOINT_XFER_ISOC:
                return "Isochronous endpoint type (currently not supported)";
        }
        return "Unknown";
    }
}
