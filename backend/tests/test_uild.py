"""
Tests for the UILD (Unique Identifier with Logging and Discovery) implementation.
"""
import time
from backend.utils.uild import UILD

def test_uild_generation():
    """Test UILD generation for different types."""
    # Test user UILD
    user_uild = UILD.generate('user')
    assert user_uild.startswith('usr-')
    assert UILD.validate(user_uild)
    
    # Test tenant UILD
    tenant_uild = UILD.generate('tenant')
    assert tenant_uild.startswith('tnt-')
    assert UILD.validate(tenant_uild)
    
    # Test with metadata
    metadata = {'org': 'test', 'role': 'admin'}
    uild_with_meta = UILD.generate('user', metadata)
    assert uild_with_meta.startswith('usr-')
    assert UILD.validate(uild_with_meta)

def test_uild_validation():
    """Test UILD validation."""
    # Test valid UILD
    valid_uild = UILD.generate('user')
    assert UILD.validate(valid_uild)
    
    # Test invalid UILDs
    assert not UILD.validate('invalid')
    assert not UILD.validate('usr-123-456')
    assert not UILD.validate('xyz-123-456-789')

def test_uild_type_extraction():
    """Test extracting type from UILD."""
    user_uild = UILD.generate('user')
    assert UILD.get_type(user_uild) == 'user'
    
    tenant_uild = UILD.generate('tenant')
    assert UILD.get_type(tenant_uild) == 'tenant'
    
    assert UILD.get_type('invalid') is None

def test_uild_timestamp():
    """Test timestamp extraction and accuracy."""
    current_time = time.time()
    uild = UILD.generate('user')
    extracted_time = UILD.get_timestamp(uild)
    
    # Should be within 1 second
    assert abs(current_time - extracted_time) < 1
    
    assert UILD.get_timestamp('invalid') is None

def test_uild_uniqueness():
    """Test that generated UILDs are unique."""
    uilds = set()
    for _ in range(1000):
        uild = UILD.generate('user')
        assert uild not in uilds
        uilds.add(uild) 