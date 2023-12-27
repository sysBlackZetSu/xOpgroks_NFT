// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/v4/access/Ownable.sol";
import "@openzeppelin/contracts/v4/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/v4/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract NFT is ERC721Enumerable, Ownable, Pausable, ReentrancyGuard {
  using Strings for uint256;

  mapping(address => bool) public isMinted;
  mapping(uint256 => uint256) private _counters;
  mapping(uint256 => uint256) public nftToCategory;

  uint256 public constant NUMBER_OF_CATEGORIES = 3;
  uint256[] public MAX_SUPPLY = [0, 50, 50, 50];

  // Base URI
  string public baseURI;
  bool public isReadyToMint;
  uint256 public mintFee;
  address public adminAddress;

  event Mint(address indexed user, uint256 indexed tokenId);

  constructor(
    string memory _name,
    string memory _symbol,
    address _adminAddress,
    uint256 _mintFee
  ) ERC721(_name, _symbol) {
    adminAddress = _adminAddress;
    mintFee = _mintFee;
    isReadyToMint = false;

    _counters[1] = 0;
    _counters[2] = _counters[1] + MAX_SUPPLY[1];
    _counters[3] = _counters[2] + MAX_SUPPLY[2];

    MAX_SUPPLY[2] = MAX_SUPPLY[1] + MAX_SUPPLY[2];
    MAX_SUPPLY[3] = MAX_SUPPLY[2] + MAX_SUPPLY[3];
  }

  function _baseURI() internal view virtual override returns (string memory) {
    return baseURI;
  }

  function isOutOfStock(uint256 categoryId) external view virtual returns (bool) {
    return _counters[categoryId] == MAX_SUPPLY[categoryId];
  }

  function setBaseURI(string memory baseURI_) external onlyOwner {
    baseURI = baseURI_;
  }

  function readyToMint() external onlyOwner whenNotPaused {
    isReadyToMint = true;
  }

  function pause() external onlyOwner whenNotPaused {
    _pause();
  }

  function unpause() external onlyOwner whenPaused {
    _unpause();
  }

  function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
    require(_exists(tokenId), "URI query for nonexistent token");

    string memory _tokenURI = nftToCategory[tokenId].toString();
    string memory base = baseURI;

    // If there is no base URI, return the token URI.
    if (bytes(base).length == 0) {
      return _tokenURI;
    }
    // If both are set, concatenate the baseURI and tokenURI (via abi.encodePacked).
    if (bytes(_tokenURI).length > 0) {
      return string(abi.encodePacked(base, _tokenURI));
    }
    // If there is a baseURI but no tokenURI, concatenate the tokenID to the baseURI.
    return string(abi.encodePacked(base, tokenId.toString()));
  }

  function mint(uint256 categoryId) external payable whenNotPaused nonReentrant returns (uint256) {
    address sender = msg.sender;
    require(categoryId > 0 && categoryId <= NUMBER_OF_CATEGORIES, "Invalid categoryId");
    require(_counters[categoryId] < MAX_SUPPLY[categoryId], "Amount exceeded");
    require(isReadyToMint, "NFT: hasn't started yet");
    require(!isMinted[sender], "NFT: already minted");
    require(mintFee == msg.value, "mintFee != msg.value");

    (bool success, ) = adminAddress.call{ value: msg.value }("");
    require(success, "Coins cannot be transferred");

    _counters[categoryId] += 1;
    uint256 tokenId = _counters[categoryId];
    nftToCategory[tokenId] = categoryId;

    _safeMint(sender, tokenId);
    isMinted[sender] = true;

    emit Mint(msg.sender, tokenId);
    return tokenId;
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721Enumerable) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  receive() external payable {
    (bool success, ) = adminAddress.call{ value: msg.value }("");
    require(success, "Coins cannot be transferred");
  }
}