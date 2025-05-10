// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract BoomToken is ERC20, Ownable, Pausable {
    uint256 private constant INITIAL_SUPPLY = 1000000000 * 10**18; // 1 billion tokens
    uint256 public maxTransactionAmount;
    mapping(address => bool) public isBlacklisted;

    event Blacklisted(address indexed account);
    event RemovedFromBlacklist(address indexed account);
    event MaxTransactionAmountUpdated(uint256 amount);

    constructor() ERC20("BOOM", "BOOM") {
        _mint(msg.sender, INITIAL_SUPPLY);
        maxTransactionAmount = INITIAL_SUPPLY;
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function blacklist(address account) public onlyOwner {
        isBlacklisted[account] = true;
        emit Blacklisted(account);
    }

    function removeFromBlacklist(address account) public onlyOwner {
        isBlacklisted[account] = false;
        emit RemovedFromBlacklist(account);
    }

    function setMaxTransactionAmount(uint256 amount) public onlyOwner {
        require(amount > 0, "Amount must be greater than 0");
        maxTransactionAmount = amount;
        emit MaxTransactionAmountUpdated(amount);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, amount);

        require(!paused(), "Token transfer while paused");
        require(!isBlacklisted[from] && !isBlacklisted[to], "Blacklisted address");
        
        if(from != owner() && to != owner()) {
            require(amount <= maxTransactionAmount, "Transfer amount exceeds limit");
        }
    }

    // Burn tokens
    function burn(uint256 amount) public virtual {
        _burn(_msgSender(), amount);
    }

    // Burn tokens from a specified account
    function burnFrom(address account, uint256 amount) public virtual {
        _spendAllowance(account, _msgSender(), amount);
        _burn(account, amount);
    }
}