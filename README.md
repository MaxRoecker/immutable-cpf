# Immutable CPF

A tiny library to handle CPF in an immutable flavour.

> The **[CPF][cpf]** (Cadastro de Pessoas Físicas, [sepeˈɛfi]; portuguese for
> "Natural Persons Register") is the Brazilian individual taxpayer registry
> identification. This number is attributed by the Brazilian Federal Revenue to
> Brazilians and resident aliens who, directly or indirectly, pay taxes in
> Brazil.

## [![View on NPM](https://img.shields.io/npm/v/immutable-cpf?style=flat-square)](https://www.npmjs.com/package/immutable-cpf) [![License](https://img.shields.io/npm/l/immutable-cpf?style=flat-square)](https://maxroecker.mit-license.org/) 🇧🇷

## Installation

Use the npm package manager to install Immutable CPF.

```bash
npm i immutable-cpf
```

## Usage

The library provides a the [`CPF`][cpfclass] class to create immutable instances
representing CPF documents. You can create instances with any iterable of digits
and format or validate them. See the example:

```js
import { CPF } from 'immutable-cpf';

const cpf = new CPF([3, 1, 6, 7, 5, 7, 4, 5, 5, 0, 1]);

cpf.equals(cpf); // true

cpf.checkValidity(); // true

cpf.format(); // '316.757.455-01'
```

You can also create instances from strings using the [`CPF.from`][cpf.from]
method.

```js
import { CPF } from 'immutable-cpf';

const cpfA = new CPF([3, 1, 6, 7, 5, 7, 4, 5, 5, 0, 1]);
const cpfB = CPF.from('316.757.455-01');
const cpfC = CPF.from('3  1  6 7 5  7 4 5  5 0   1   ');

cpfA.equals(cpfB); // true

cpfA.equals(cpfC); // true
```

> The `CPF` class implements the [`Evaluable`][evaluable] interface and it's
> suitable to be used along [ImmutableJS][immutablejs] data structures.

The method [`CPF.prototype.getValidity`][cpf.getvalidity] returns the validity
state of the instance. If you only want to check if the instance is valid or
not, see the [`CPF.prototype.checkValidity`][cpf.checkvalidity] method.

```js
import { CPF } from 'immutable-cpf';

const empty = new CPF([]);
empty.checkValidity(); // false, it's empty

const semi = new CPF([3, 1, 6, 7]);
semi.checkValidity(); // false, it's not complete

const invalid = new CPF([3, 1, 6, 7, 5, 7, 4, 5, 5, 1, 2]);
semi.checkValidity(); // false, its check digits fails

const valid = new CPF([3, 1, 6, 7, 5, 7, 4, 5, 5, 0, 1]);
valid.checkValidity(); // true
```

The library also provides the method [`CPF.create`][cpf.create] to generate
valid instances with pseudo-random numbers.

```js
import { CPF } from 'immutable-cpf';

const cpf = CPF.create();

cpf.checkValidity(); // true
```

The default JSON serialization a `CPF` instance is a string. You can also access
it directly calling the [`CPF.prototype.toJSON`][cpf.tojson].

```js
import { CPF } from 'immutable-cpf';

const user = {s
  name: 'José Silva',
  cpf: new CPF([3, 1, 6, 7, 5, 7, 4, 5, 5, 0, 1]),
};

JSON.stringify(user); // '{"name": "José Silva", "cpf": "31675745501"}'

user.cpf.toJSON(); // '31675745501'
```

## API

See the complete API on the [Wiki's page][wiki].

## Contributing

Pull requests are welcome. For major changes, please open an issue first to
discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://maxroecker.mit-license.org/)

[evaluable]: https://github.com/MaxRoecker/evaluable
[wiki]: https://github.com/MaxRoecker/immutable-cpf/wiki
[cpf]: https://en.wikipedia.org/wiki/CPF_number
[cpfclass]: https://github.com/MaxRoecker/immutable-cpf/wiki#class-cpf
[cpf.from]: https://github.com/MaxRoecker/immutable-cpf/wiki#from
[cpf.getvalidity]: https://github.com/MaxRoecker/immutable-cpf/wiki#getvalidity
[cpf.checkvalidity]: https://github.com/MaxRoecker/immutable-cpf/wiki#checkvalidity
[cpf.create]: https://github.com/MaxRoecker/immutable-cpf/wiki#create
[cpf.tojson]: https://github.com/MaxRoecker/immutable-cpf/wiki#tojson
[immutablejs]: https://immutable-js.github.io/immutable-js/
