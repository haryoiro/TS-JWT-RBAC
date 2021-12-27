import { useDisclosure, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input, ModalFooter, Spacer } from "@chakra-ui/react"
import React from "react"
import { Calendar } from "../helper/calendar"
import { calendarActions } from "../state/calendar.state"
import { CalendarComponent } from "./Calendar"

export const ModalCalendar: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const setSelectedDate = calendarActions.setSelectedDate();
  const cal = new Calendar()

  const resetCalendar = () => {
    setSelectedDate(cal.getToday())
  }

  return (
    <>
      <Button onClick={onOpen}>Cal</Button>

      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader />
          <ModalCloseButton />
          <ModalBody>
            <CalendarComponent />
          </ModalBody>

          <ModalFooter>
            <Button
              variant='ghost'
              onClick={() => resetCalendar()}
            >
              Reset
            </Button>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              OK
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}