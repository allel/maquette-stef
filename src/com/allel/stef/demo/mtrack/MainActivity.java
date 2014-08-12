package com.allel.stef.demo.mtrack;

import android.app.Activity;
import android.os.Bundle;
import org.apache.cordova.Config;
import org.apache.cordova.CordovaActivity;

/**
 * Created with IntelliJ IDEA.
 * User: Allel
 * Date: 15/07/2014
 * Time: 10:19
 * To change this template use File | Settings | File Templates.
 */
public class MainActivity extends CordovaActivity {


    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        super.init();
        // Set by <content src="index.html" /> in config.xml
        super.loadUrl(Config.getStartUrl());
        //super.loadUrl("file:///android_asset/www/index.html")
    }


}
