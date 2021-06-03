# Immutable CPF

A tiny library to handle CPF (Cadastro de Pessoa Física), a brazilian
identification document, in an immutable flavour.

[![View on NPM](https://img.shields.io/npm/v/immutable-cpf?style=flat-square)](https://www.npmjs.com/package/immutable-cpf)
[![License](https://img.shields.io/npm/l/immutable-cpf?style=flat-square)](https://maxroecker.mit-license.org/)

## Installation

Use the npm package manager to install Immutable CPF.

```bash
npm i immutable-cpf
```

## Usage

The library provides a the [`CPF`][CPF] class to create immutable instances
representing CPFs documents. You can create instances with any iterable of
digits. See the example:

```js
import { CPF } from 'immutable-cpf';

const cpf = new CPF([3, 1, 6, 7, 5, 7, 4, 5, 5, 0, 1]);

cpf.equals(cpf) // true

cpf.checkValidity() // true

cpf.format() // '316.757.455-01'
```

You can also create instances from strings using the [`CPF.from`][CPF.from]
method.

```js
import { CPF } from 'immutable-cpf';

const cpfA = new CPF([3, 1, 6, 7, 5, 7, 4, 5, 5, 0, 1]);
const cpfB = CPF.from('316.757.455-01');
const cpfC = CPF.from('3  1  6 7 5  7 4 5  5 0   1   ');

cpfA.equals(cpfB); // true

cpfA.equals(cpfC); // true
```

> The `CPF` class implements the [`Evaluable`][Evaluable] interface, so it is
> suitable to be used along with the [ImmutableJS][ImmutableJS] data structures.

The library also provides the method [`CPF.create`][CPF.create] to generate
valid instances with pseudo-random numbers.

```js
import { CPF } from 'immutable-cpf';

const cpf = CPF.create();

cpf.checkValidity() // true
```

The default JSON serialization a `CPF` instance is a string. You can also access
it directly calling the [`CPF.prototype.toJSON`][CPF.toJSON].

```js
import { CPF } from 'immutable-cpf';

const cpf = new CPF([3, 1, 6, 7, 5, 7, 4, 5, 5, 0, 1]);

const user = { name: 'José Silva', cpf };

JSON.stringify(user) // '{"name": "José Silva", "cpf": "31675745501"}'
```

See the complete API on the [Wiki's page][Wiki].

## Contributing

Pull requests are welcome. For major changes, please open an issue first to
discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://maxroecker.mit-license.org/)

[Evaluable]: https://github.com/MaxRoecker/evaluable
[Wiki]: https://github.com/MaxRoecker/immutable-cpf/wiki
[CPF]: https://github.com/MaxRoecker/immutable-cpf/wiki#class-cpf
[CPF.from]: https://github.com/MaxRoecker/immutable-cpf/wiki#from
[CPF.create]: https://github.com/MaxRoecker/immutable-cpf/wiki#create
[CPF.toJSON]: https://github.com/MaxRoecker/immutable-cpf/wiki#tojson
[ImmutableJS]: https://immutable-js.github.io/immutable-js/
