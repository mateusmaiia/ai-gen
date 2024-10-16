import { useUsage } from '@/context/usage'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import Link from 'next/link'
import { Button } from '../ui/button'

export default function SignUpModal() {
  const {openModal, setOpenModal } = useUsage()

  return (
    <Dialog open={openModal} onOpenChange={() => 
        openModal ? setOpenModal(!openModal) : setOpenModal(openModal)
      }
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>🚀 Unlock unlimited AI-Powered content!</DialogTitle>
          <br />
          <DialogDescription>
            <p>
              🎉 Congrats! You have  genereted 10,000 word with our AI tool. That's amazing!
            </p>
            <p>
              🔒 Ready to take your content creation to the next level? Upgrade to a paid plan and enjoy!
            </p>
            <ul className="mt-5 ml-3">
              <li>✨ Unlimited word generation</li>
              <li>🧠 Advanced AI features</li>
              <li>⚡ Faster processing times</li>
              <li>🛠️ Priority customer support</li>
            </ul>
            <br />
            <p>
              💡 Don't let your creativity hit a wall. Upgrade now and keep the ideas flowing!
            </p>

            <div className="m-5 text-center">
              <Link href="/membership">
                <Button>Join Membership</Button>
              </Link>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
