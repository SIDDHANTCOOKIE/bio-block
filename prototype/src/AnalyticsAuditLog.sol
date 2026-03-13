// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AnalyticsAuditLog {
    address public owner;
    address public authorizedLogger;

    event AnalyticsAccess(
        address indexed requester,
        string indexed dataset,
        string analysisType,
        uint256 timestamp
    );

    modifier onlyAuthorizedLogger() {
        require(
            msg.sender == owner || msg.sender == authorizedLogger,
            "Caller is not authorized"
        );
        _;
    }

    constructor(address _authorizedLogger) {
        owner = msg.sender;
        authorizedLogger = _authorizedLogger;
    }

    function logAnalyticsAccess(
        address requester,
        string calldata dataset,
        string calldata analysisType
    ) external onlyAuthorizedLogger {
        emit AnalyticsAccess(requester, dataset, analysisType, block.timestamp);
    }
}
