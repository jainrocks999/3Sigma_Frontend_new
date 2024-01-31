package com.threesigma.provider;

import android.net.Uri;

public interface Const {
    String AUTH = "com.threesigma";
    String TABLE_NAME = "auth";
    Uri CONTENT_URI = Uri.parse("content://"+AUTH+"/"+TABLE_NAME);
    String DATABASE_NAME = "data_provider";
    String AUTH_COLUMN = "auth_key";
    int DB_VERSION = 1;
}
