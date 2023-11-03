---- Installation ----

be sure to have docker installed in your work machine
If you are not working with Linux, you may also install Make 

then run :
```
make install
```

---- Commands ----

Run the app on the container :
```
make build run
```

Stop the app on the container :
```
make stop
```

Run the appoutside of the container (only use for debug) :
```
make quickStart
```

Restart the app on the container :
```
make build restart
```