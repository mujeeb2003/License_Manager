import React, { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Input,
  VStack,
  Tag,
  TagLabel,
  TagCloseButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

interface Option {
  value: number;
  label: string;
}

interface CustomMultiSelectProps {
  options: Option[];
  selectedValues: number[];
  onChange: (selectedValues: number[]) => void;
  placeholder?: string;
}

const CustomMultiSelect: React.FC<CustomMultiSelectProps> = ({
  options,
  selectedValues,
  onChange,
  placeholder = 'Select options',
}) => {
  const [search, setSearch] = useState('');

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase())
  );

  const toggleOption = (value: number) => {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    onChange(newSelectedValues);
  };

  const removeOption = (valueToRemove: number) => {
    onChange(selectedValues.filter((value) => value !== valueToRemove));
  };

  return (
    <Box>
      <Menu closeOnSelect={false}>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />} w="100%">
          {selectedValues.length > 0 ? `${selectedValues.length} selected` : placeholder}
        </MenuButton>
        <MenuList maxH="300px" overflowY="auto" p={2}>
          <Input
            placeholder="Search domains..."
            mb={2}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
          <VStack align="stretch">
            {filteredOptions.map((option) => (
              <MenuItem key={option.value} onClick={() => toggleOption(option.value)}>
                <Checkbox
                  isChecked={selectedValues.includes(option.value)}
                >
                  {option.label}
                </Checkbox>
              </MenuItem>
            ))}
          </VStack>
        </MenuList>
      </Menu>

      <Flex mt={2} flexWrap="wrap" gap={2}>
        {selectedValues.map((value) => {
          const option = options.find((o) => o.value === value);
          return (
            option && (
              <Tag
                key={value}
                size="md"
                borderRadius="full"
                variant="solid"
                colorScheme="blue"
              >
                <TagLabel>{option.label}</TagLabel>
                <TagCloseButton onClick={() => removeOption(value)} />
              </Tag>
            )
          );
        })}
      </Flex>
    </Box>
  );
};

export default CustomMultiSelect;