# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# Preserve source file and line numbers for Crashlytics symbolication.
-keepattributes SourceFile,LineNumberTable
-keep public class * extends java.lang.Exception

# React Native, Hermes, Firebase and dynamically loaded Expo modules.
-keep class com.facebook.react.** { *; }
-keep class com.facebook.jni.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.google.firebase.** { *; }
-keep class expo.modules.** { *; }
-keepattributes *Annotation*,Signature

# RNScreensFragmentFactory identifies restored fragments by their package name.
-keepnames class com.swmansion.rnscreens.** extends androidx.fragment.app.Fragment
