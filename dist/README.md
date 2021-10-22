<h1 align="center"> deepvalid </h1>
<p align="center">
  <b>deepvalid is a simple node.js library for validation API input params</b>
</p>

## Description
deep-validation helps you build API input params validation

## Installation

```bash
npm i deepvalid
```

## Features

* Zero Dependencies
* Supports deep input object
* Very simple small library
* Focus on usability and performance
* Testing coverage


```bash
Run tests with Mocha

$ npm run test
```

## Usage

```javascript
import {validator, ValidationError, required} from "deepvalid";

try {
    const request = {test: "test value"};
    const valid = validator();
    valid.setModel({"test": {required}});
    valid.validate(request);
    
    return true;
} catch(err) {
    const e: ValidationError = err;
    console.log(e.getMessage())
}

```
