package com.threesigma.provider;

import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

public class SqlHelper extends SQLiteOpenHelper {


    public SqlHelper(Context context) {
        super(context, Const.DATABASE_NAME, null, Const.DB_VERSION);
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        String sql = "create table " + Const.TABLE_NAME + " (_id integer primary key autoincrement, " +
                Const.AUTH_COLUMN + " text" +
                " )";
        db.execSQL(sql);
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        db.execSQL("drop table if exists " + Const.TABLE_NAME);
    }
}
