"""
UILD (Unique Identifier with Logging and Discovery) implementation.
"""
import time
import uuid
import hashlib
from typing import Optional, Dict

class UILD:
    PREFIX_MAP = {
        'user': 'usr',
        'tenant': 'tnt',
        'session': 'ses',
        'document': 'doc',
        'transaction': 'txn',
        'product': 'prd',
        'order': 'ord',
        'invoice': 'inv'
    }
    
    @staticmethod
    def generate(prefix_type: str, metadata: Optional[Dict] = None) -> str:
        """Generate a new UILD."""
        if prefix_type not in UILD.PREFIX_MAP:
            raise ValueError(f"Invalid prefix type. Must be one of: {', '.join(UILD.PREFIX_MAP.keys())}")
        
        # Get prefix
        prefix = UILD.PREFIX_MAP[prefix_type]
        
        # Generate components
        timestamp = hex(int(time.time() * 1000))[2:]  # millisecond precision
        random = uuid.uuid4().hex[:8]  # 8 characters for randomness
        
        # Create base UILD
        base = f"{prefix}-{timestamp}-{random}"
        
        # Generate checksum
        checksum = hashlib.sha256(
            (base + (str(metadata) if metadata else "")).encode()
        ).hexdigest()[:4]
        
        return f"{base}-{checksum}"
    
    @staticmethod
    def validate(uild: str) -> bool:
        """Validate a UILD string."""
        try:
            # Split UILD into components
            prefix, timestamp, random, checksum = uild.split('-')
            
            # Validate prefix
            if prefix not in UILD.PREFIX_MAP.values():
                return False
            
            # Validate timestamp (hexadecimal)
            int(timestamp, 16)
            
            # Validate random component (8 hex characters)
            if len(random) != 8 or not all(c in '0123456789abcdef' for c in random.lower()):
                return False
            
            # Validate checksum length
            if len(checksum) != 4:
                return False
            
            return True
            
        except (ValueError, IndexError):
            return False
    
    @staticmethod
    def get_type(uild: str) -> Optional[str]:
        """Get the type of entity from a UILD."""
        try:
            prefix = uild.split('-')[0]
            return next(
                (k for k, v in UILD.PREFIX_MAP.items() if v == prefix),
                None
            )
        except (ValueError, IndexError):
            return None
    
    @staticmethod
    def get_timestamp(uild: str) -> Optional[float]:
        """Get the creation timestamp from a UILD."""
        try:
            timestamp_hex = uild.split('-')[1]
            return int(timestamp_hex, 16) / 1000
        except (ValueError, IndexError):
            return None 