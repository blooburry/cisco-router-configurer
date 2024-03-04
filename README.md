# Cisco Router Configurer
*by blooburry*

This project is a library containing the following functionality:

1. CiscoConfig Interface
2. formatConfig function
3. exportConfig function

The purpose is to make configuring Cisco routers quicker and safer by using type-safety. 

## Usage

In `src/index.ts`, you can find an example usage of this library. You basically create a Cisco config as a TS object, then format it and export it to your filesystem.

## CiscoConfig Interface
This interface contains many (but not all) of the configurations that are possible on a Cisco router, with explanatory JSdoc. Because it uses the TS type system, IntelliSense can help you out writing the configuration as a TS object.

## formatConfig function
This function turns your TS object into a valid configuration file that can be used in the router. In Packet Tracer, the file can be imported as a Startup Config.

## Notes

### Stability
There is no guarantee that the generated file is actually a valid router configuration. You can still generate invalid configs with this library.

### Password encryption

Cisco uses a number of password encryption algorithms on their routers, some of which are proprietary. Because this library was meant to be used for my own study, the only allowed passwords are `cisco` and `class`, and the ciphertexts of these passwords for Type 5 and 7 encryption are hardcoded into the program. Feel free to change the `CiscoConfig` interface to allow other passwords.



