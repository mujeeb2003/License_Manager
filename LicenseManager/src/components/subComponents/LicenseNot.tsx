import { useSelector } from 'react-redux';
import type { RootState } from '../../types';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';

function LicenseNot() {
    const { licExpInWeek,newLic} = useSelector((state:RootState)=>state.license);


  return (
    <div className="upcoming">
      <div className="header">
        <h4>Notifications</h4>
      </div>
        <Tabs variant='soft-rounded' colorScheme='green'>
            <TabList>
                <Tab fontSize={12}>Lincense Expiring in next 7 days</Tab>
                <Tab fontSize={12}>New Licenses added today</Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                <div className="events">
                    {licExpInWeek.map((notification) => (
                    <div className="item" key={notification.license_id}>
                        <div>
                        <i className='bx bx-time'></i>
                        <div className="event-info">
                            <a href="#">License {notification.title} is about to expire</a>
                            <p>Expires on: {(notification.expiry_date).toString().split('T')[0].split('-').reverse().join("-")}</p>
                        </div>
                        </div>
                        <i className='bx bx-dots-horizontal-rounded'></i>
                    </div>
                    ))}
                </div>
                </TabPanel>
                <TabPanel>
                <div className="events">
                    {newLic.map((notification) => (
                    <div className="item" key={notification.license_id}>
                        <div>
                        <i className='bx bx-time'></i>
                        <div className="event-info">
                            <a href="#">License {notification.title} added </a>
                            <p>Expires on: {(notification.expiry_date).toString().split('T')[0].split('-').reverse().join("-")}</p>
                        </div>
                        </div>
                        <i className='bx bx-dots-horizontal-rounded'></i>
                    </div>
                    ))}
                </div>
                </TabPanel>
            </TabPanels>
        </Tabs>
    </div>
  );
}

export default LicenseNot;
