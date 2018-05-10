/*
 * Copyright (c) 2016-present,
 * Jaguar0625, gimre, BloodyRookie, Tech Bureau, Corp. All rights reserved.
 *
 * This file is part of Catapult.
 *
 * Catapult is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Catapult is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Catapult.  If not, see <http://www.gnu.org/licenses/>.
 */

const NodePositionEnum = Object.freeze({
	left: 1,
	right: 2
});

class HashNotFoundError extends Error {}

const getRootHash = tree => tree.nodes[tree.nodes.length - 1];

const evenify = number => (number % 2 ? number + 1 : number);

const indexOfNodeWithHash = (hash, tree) => tree.nodes.slice(0, evenify(tree.numberOfTransactions)).indexOf(hash);

const siblingOf = nodeIndex => {
	if (0 > nodeIndex)
		return null;

	if (nodeIndex % 2) {
		return {
			position: NodePositionEnum.left,
			index: nodeIndex - 1
		};
	}
	return {
		position: NodePositionEnum.right,
		index: nodeIndex + 1
	};
};

const buildAuditPath = (hash, tree) => {
	let layerStart = 0;
	let currentLayerCount = tree.numberOfTransactions;
	let layerSubindexOfHash = indexOfNodeWithHash(hash, tree);
	if (-1 === layerSubindexOfHash)
		throw new HashNotFoundError();

	const auditPath = [];
	while (1 !== currentLayerCount) {
		currentLayerCount = evenify(currentLayerCount);
		const sibling = siblingOf(layerStart + layerSubindexOfHash);
		const siblingPathNode = {
			hash: tree.nodes[sibling.index],
			position: sibling.position
		};
		auditPath.push(siblingPathNode);
		layerStart += currentLayerCount;
		currentLayerCount /= 2;
		layerSubindexOfHash = Math.floor(layerSubindexOfHash / 2);
	}
	return auditPath;
};

module.exports = {
	buildAuditPath,
	getRootHash,
	evenify,
	indexOfNodeWithHash,
	siblingOf,
	NodePositionEnum,
	HashNotFoundError
};
