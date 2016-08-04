app.service("$mql", [function() {
	var self = this;
	
	this.query = function (query, args) {
		/*query = query.replace(/#.+/g, function (match, number) {
			var name = match.substring(1);
			var value = args[name];
			
			// asdfasdf'asdfasd\'asdfasdf
			// asdfasdf\'asdfasd\\\'asdfasdf
			if (typeof value === 'string') {
				value = "'" + value.replace("\\'", "\\\\'").replace("'", "\\'") + "'";
			}
			
			return value;
		});*/
		
		var tableName = query.match(/from\s((\[.+\])|\S+)/gi);
		
		if (tableName.length > 0) {
			if (typeof tableName !== 'string') {
				tableName = tableName[tableName.length - 1];
			}
			
			tableName.replace(/from\s+/gi, "");
			
			if (!tableName.indexOf("[") == 0) {
				tableName = tableName.substring(1, tableName.length - 1);
			}
		} else {
			tableName = undefined;
		}
		
		return {
			tableName: tableName,
			query: query,
			parameters: args
		};
	};
	
	this.queryBuilder = function (parent, selection) {
		var builder = {
			data: {
				selections: [],
				from: undefined,
				joins: [],
				limit: undefined,
				where: "",
				groupBy: [],
				orderBy: [],
				innerSelections: {},
				args: {}
			},
			select: function (selection, alias) {
				if (isArray(selection)) {
					selection.forEach(function (element) {
						builder.select(element);
					});
				} else {
					builder.data.selections.push(selection + (alias ? " as " + alias : ""));
				}
				
				return builder;
			},
			join: function (type, table, on) {
				builder.data.joins.push("{0} join {1} on {2}".format(type, table, on));
				
				return builder;
			},
			from: function (from) {
				builder.data.from = from;
				
				return builder;
			},
			where: function (where) {
				builder.data.where += builder.data.where.length > 0 ? " " + where: where;
				
				return builder;
			},
			limit: function (limit) {
				builder.data.limit = limit;
				
				return builder;
			},
			groupBy: function (groupBy) {
				builder.data.groupBy.push(groupBy);
				
				return builder;
			},
			orderBy: function (orderBy) {
				builder.data.orderBy.push(orderBy);
				
				return builder;
			},
			enter: function () {
				var selection = builder.data.selections[builder.data.selections.length - 1];
				
				return builder.data.innerSelections[selection] = self.queryBuilder(builder, selection);
			},
			exit: function () {
				parent.data.selections[parent.data.selections.indexOf(selection)] = "\n" + selection + " {\n\t" + builder.toString().replace(/\n/g, "\n\t") + "\n}";
				
				return parent;
			},
			arg: function (args) {
				for (var key in args) {
					builder.data.args[key] = args[key];
				}
				
				return builder;
			},
			toString: function () {
				return "select {0}\nfrom {1}\n{2?}\n{3?}\n{4?}\n{5?}\n{6?}".format(
						builder.data.selections.join(", "),
						builder.data.from,
						builder.data.joins.join("\n"),
						builder.data.where ? "where " + builder.data.where.trim() : undefined,
						builder.data.orderBy.length > 0 ? "order by " + builder.data.orderBy.join(", ") : undefined,
						builder.data.groupBy.length > 0 ? "group by " + builder.data.groupBy.join(", ") : undefined,
						builder.data.limit ? "limit " + builder.data.limit : undefined).trim().replace(/\n{2,}/g, "\n");
			},
			toMQL: function () {
				return self.query(builder.toString(), builder.data.args);
			}
		};
		
		var builderStack = [builder];
		
		return builder;
	};
}]);