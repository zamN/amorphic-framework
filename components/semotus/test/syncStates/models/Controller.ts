import {property, remote, Supertype, supertypeClass} from '../../../dist';
import {Customer} from './Customer';
import {Account} from './Account';
import {Address} from './Address';

var ObjectTemplate = require('../../../dist');
var delay = require('../../../dist/helpers/Utilities.js').delay;
ObjectTemplate['toClientRuleSet'] = ['ClientRule'];
ObjectTemplate['toServerRuleSet'] = ['ServerRule'];


@supertypeClass
export class Controller extends Supertype {
	@property()
	sam: Customer;
	@property()
	karen: Customer;
	@property()
	ashling: Customer;

	constructor() {
		super();

		// Setup customers and addresses
		var sam = new Customer('Sam', 'M', 'Elsamman');
		var karen = new Customer('Karen', 'M', 'Burke');
		var ashling = new Customer('Ashling', '', 'Burke');

		// Setup referrers
		sam.referrers = [ashling, karen];
		ashling.referredBy = sam;
		karen.referredBy = sam;


		// Setup addresses
		sam.addAddress(['500 East 83d', 'Apt 1E'], 'New York', 'NY', '10028');
		sam.addAddress(['38 Haggerty Hill Rd', ''], 'Rhinebeck', 'NY', '12572');

		karen.addAddress(['500 East 83d', 'Apt 1E'], 'New York', 'NY', '10028');
		karen.addAddress(['38 Haggerty Hill Rd', ''], 'Rhinebeck', 'NY', '12572');


		ashling.addAddress(['End of the Road', ''], 'Lexington', 'KY', '34421');

		// Setup accounts
		var samsAccount = new Account(1234, ['Sam Elsamman'], sam, sam.addresses[0]);
		var jointAccount = new Account(123, ['Sam Elsamman', 'Karen Burke', 'Ashling Burke'], sam, karen.addresses[0]);
		jointAccount.addCustomer(karen, 'joint');
		jointAccount.addCustomer(ashling, 'joint');

		samsAccount.credit(100); // Sam has 100
		samsAccount.debit(50); // Sam has 50
		jointAccount.credit(200); // Joint has 200
		jointAccount.transferTo(100, samsAccount); // Joint has 100, Sam has 150
		jointAccount.transferFrom(50, samsAccount); // Joint has 150, Sam has 100
		jointAccount.debit(25); // Joint has 125

		this.sam = sam;
		this.karen = karen;
		this.ashling = ashling;
	}

	@remote({
		on: 'server'
	})
	mainFunc(...args): Promise<any> {
		return ObjectTemplate.serverAssert();
	}


	giveSamASecondAccount() {
		var address = new Address(this.sam, ['Plantana']);
		var samsNewAccount = new Account(1234, ['Sam Elsamman'], this.sam, address);
		samsNewAccount.addCustomer(this.sam, 'sole');
	}
}