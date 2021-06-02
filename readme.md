<h1 align="center"> deep-validation </h1>
<p align="center">
  <b>deep-validation is a simple node.js library for validation API input params</b>
</p>

## Description
deep-validation helps you build API input params validation

## Installation

```bash
npm i deep-validation
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
import validation, {ValidationError, required} from "deep-validation";

try {
    const request = {test: "test value"};
    const validator = validation();
    validator.setModel({"test": {required}});
    validator.validate(request);
    
    return true;
} catch(err) {
    const e: ValidationError = err;
    console.log(e.getMessage())
}

```
