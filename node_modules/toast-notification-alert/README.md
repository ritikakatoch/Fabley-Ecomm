# TOAST NOTIFY


## Features


#### `examples/index.html`

To display a simple toast message at the top-left

```js 
toast.show({title: 'first toast', position: 'topleft'}) 
```


## Quick start


STEP ONE 

Running the script directly on the browser console
1.  Copy the index script from `lib/index.umd.js`
2.  Paste in browser console
3.  Run `toast.show({title: 'first toast', position: 'topleft'})`

STEP TWO (Via NPM) Recommended

 `npm i toast-notification-alert`
 
```js
import { toast } from 'toast-notification-alert'

toast.show({title: 'first toast', position: 'topright', type: 'info'})
```

Now you're ready to rumble!

## Show() Options

|Option|Description|
|-|:-----:|
|`message`|Message to be displayed
|`position`|topleft, topright,bottomleft, bottomright, bottomfullwidth, topfullwidth, bottomcenter, topcenter
|`type`|warn, info, alert


## NOTE

The toast notification container position foreach screen is set by the first notification instance that shows up,
a page can not have two notification position set.


## License

This project is licensed under the MIT license, Copyright (c) 2020.
