define(['knockout', '../InputTypes/Range', '../InputTypes/Concept'], function (ko, Range, Concept) {

	function DoseEra(data) {
		var self = this;
		data = data || {};

		// General Condition Occurence Criteria

		// Verbatim fields
		self.CodesetId = ko.observable(data.CodesetId);

		self.EraStartDate = ko.observable(data.EraStartDate && new Range(data.EraStartDate));
		self.EraEndDate = ko.observable(data.EraEndDate && new Range(data.EraEndDate));
		self.Unit = ko.observable(data.Unit && ko.observableArray(data.Unit.map(function (d) {
			return new Concept(d);
		}))); 
		self.DoseValue = ko.observable(data.DoseValue && new Range(data.DoseValue));
		self.EraLength = ko.observable(data.EraLength && new Range(data.EraLength));

		// Derived Fields
		self.First = ko.observable(data.First || null);
		self.AgeAtStart = ko.observable(data.AgeAtStart && new Range(data.AgeAtStart));
		self.AgeAtEnd = ko.observable(data.AgeAtEnd && new Range(data.AgeAtEnd));

		// Linked Fields
		self.Gender = ko.observable(data.Gender && ko.observableArray(data.Gender.map(function (d) {
			return new Concept(d);
		})));
	}

	DoseEra.prototype.toJSON = function () {
		return this;
	}
	return DoseEra;
});