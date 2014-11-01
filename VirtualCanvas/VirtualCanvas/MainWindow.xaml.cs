using Microsoft.Kinect;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using System.IO;

using System.Net;
using System.Collections.Specialized;


namespace KinectHandTracking
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {

        static Stopwatch timer = null;
        static string url = "http://172.26.5.118:3000/csharp/";
        static bool calibrated = true;

        #region Members

        KinectSensor _sensor;
        MultiSourceFrameReader _reader;
        IList<Body> _bodies;

        #endregion

        #region Constructor

        public MainWindow()
        {
            InitializeComponent();
            //socket.Connect();
        }

        #endregion

        #region Event handlers

        private void Window_Loaded(object sender, RoutedEventArgs e)
        {
            //Process.Start(@"C:\Windows\System32\KinectService.exe");

            _sensor = KinectSensor.GetDefault();

            if (_sensor != null)
            {
                _sensor.Open();

                _reader = _sensor.OpenMultiSourceFrameReader(FrameSourceTypes.Color | FrameSourceTypes.Depth | FrameSourceTypes.Infrared | FrameSourceTypes.Body);
                _reader.MultiSourceFrameArrived += Reader_MultiSourceFrameArrived;
            }
        }

        private void Window_Closed(object sender, EventArgs e)
        {
            if (_reader != null)
            {
                _reader.Dispose();
            }

            if (_bodies != null)
            {
                if (_bodies.Count() > 0)
                {
                    foreach (var body in _bodies)
                    {
                       
                       // body.Dispose();
                    }
                }
            }

            if (_sensor != null)
            {
                _sensor.Close();
            }
        }

        void Reader_MultiSourceFrameArrived(object sender, MultiSourceFrameArrivedEventArgs e)
        {
            var reference = e.FrameReference.AcquireFrame();

            // Color
            using (var frame = reference.ColorFrameReference.AcquireFrame())
            {
                if (frame != null)
                {
                    camera.Source = frame.ToBitmap();
                }
            }

            // Body
            using (var frame = reference.BodyFrameReference.AcquireFrame())
            {
                if (frame != null)
                {
                    canvas.Children.Clear();

                    _bodies = new Body[frame.BodyFrameSource.BodyCount];

                    frame.GetAndRefreshBodyData(_bodies);

                    foreach (var body in _bodies)
                    {
                        if (body != null)
                        {
                            if (body.IsTracked)
                            {
                                // Find the joints
                                Joint handRight = body.Joints[JointType.HandRight];
                                Joint thumbRight = body.Joints[JointType.ThumbRight];
                                Joint tipRight = body.Joints[JointType.HandTipRight];

                                Joint handLeft = body.Joints[JointType.HandLeft];
                                Joint thumbLeft = body.Joints[JointType.ThumbLeft];
                                Joint tipLeft = body.Joints[JointType.HandTipLeft];

                                // Draw hands and thumbs
                                //canvas.DrawHand(handRight);
                                //canvas.DrawHand(handLeft);
                                //canvas.DrawThumb(thumbRight);
                                //canvas.DrawThumb(thumbLeft);
                                canvas.DrawThumb(tipRight);
                                canvas.DrawThumb(tipLeft);

                                tblLeftPos.Text = "X: " + tipLeft.Position.X.ToString() + " \nY: " + tipLeft.Position.Y.ToString() + " \nZ: " + tipLeft.Position.Z.ToString();
                                tblRightPos.Text = "X: " + tipRight.Position.X.ToString() + " \nY: " + tipRight.Position.Y.ToString() + " \nZ: " + tipRight.Position.Z.ToString();

                                using (var wb = new WebClient())
                                {
                                    var data = new NameValueCollection();
                                    data["xValue"] = tipRight.Position.X.ToString();
                                    data["yValue"] = tipRight.Position.Y.ToString();

                                    var response = wb.UploadValues(url, "POST", data);
                                }
                                System.Threading.Thread.Sleep(33);
                            }
                        }
                    }
                }
            }
        }

        #endregion
    }
}
