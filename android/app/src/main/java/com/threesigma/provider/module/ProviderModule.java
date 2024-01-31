package com.threesigma.provider.module;

import android.content.ContentValues;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.threesigma.provider.Const;


public class ProviderModule extends ReactContextBaseJavaModule{

    private ReactApplicationContext reactContext;

    public ProviderModule(@Nullable ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @ReactMethod
    public void updateToken(String token) {
        ContentValues cv = new ContentValues();
        cv.put(Const.AUTH_COLUMN, token);
        this.reactContext.getContentResolver().insert(Const.CONTENT_URI, cv);
    }

    @NonNull
    @Override
    public String getName() {
        return getClass().getSimpleName();
    }
}
